# AgentSecrets vs HashiCorp Vault

HashiCorp Vault is the industry standard for enterprise secrets management. Vault 2.0 (April 2026) introduced Agent Registry + OAuth resource server for AI agent identity governance. The Vault MCP Server (beta, July 2025) adds MCP protocol support.

Despite these additions, Vault's core credential delivery model has not changed.

## The Credential Delivery Gap

### The Vault Model

Every credential delivery path in Vault — API call, Vault Agent sidecar, MCP Server, SDK — follows the same pattern: the application requests a secret, and Vault returns the plaintext value over TLS. The application then holds the credential in its process memory and uses it directly.

For an AI agent connected to Vault:

- **Vault API**: Agent calls `vault kv get secret/STRIPE_KEY` → receives plaintext stripe key in response → holds in agent context
- **Vault Agent Sidecar**: Agent reads files from `/vault/secrets/` (shared memory volume) → plaintext on disk in the pod
- **Vault MCP Server**: Agent calls MCP tool `vault_read` → receives secret value in LLM context. HashiCorp's own docs warn: "may expose secrets to MCP clients and LLMs"

### What Agent Registry (Vault 2.0.3+) Does

The Agent Registry adds identity governance: each agent authenticates via OAuth 2.0 JWT, gets an ephemeral token, and Vault evaluates `authorization_details` claims per request. This controls *which* secrets an agent can read, but does not change *how* the credential is delivered — the agent still receives the plaintext value.

### The AgentSecrets Model (No `get()` Principle)

AgentSecrets has no `get()` method. The agent never requests a credential value. Instead:

1. The agent makes an API call through the AgentSecrets proxy, passing the key name as a reference
2. The proxy resolves the actual credential from the OS keychain in an isolated process
3. The proxy injects the credential at the transport layer and forwards the request
4. The agent receives only the API response — never the credential

**The AI agent never receives, holds, or processes the plaintext credential.**

## Comparison

| | HashiCorp Vault | AgentSecrets |
|---|---|---|
| **Delivery model** | Request-and-receive (`vault read`, `kv get`) | Transport-layer injection (no `get()`) |
| **Agent sees credential** | Yes — in API response, file, or LLM context | No — never enters agent context |
| **AI agent identity** | Agent Registry (2.0.3+, Enterprise) with OAuth + RAR | Cryptographic tokens (`agent register`) with capability policies |
| **Per-secret constraints** | ACLs / Sentinel policies (access control) | Domain + method restrictions (`secrets policy set`) |
| **Process verification** | Vault Agent uses Kubernetes auth | `keychain-auth` daemon (SHA-256 binary hash) |
| **MCP support** | Vault MCP Server (beta) | Native ZK-MCP (`@agentsecrets/mcp`) |
| **Storage** | Vault storage backend (Raft, Consul, etc.) | OS keychain (local-first) |

## When to Use Which

### Use HashiCorp Vault when:
- You need dynamic, time-bound secrets (e.g., generating short-lived AWS IAM roles, database credentials)
- You manage PKI, certificate issuance, and SSH
- Your infrastructure requires Vault's storage backend and replication
- You are building traditional microservices, not AI agents

### Use AgentSecrets when:
- You are building AI agents (LangChain, CrewAI, AutoGen, Claude, Cursor)
- You need to guarantee that prompt injections cannot leak credentials at the infrastructure level
- You want cryptographic agent identity binding with per-agent secret policies
- You want secrets to never exist on disk or in agent process memory

### Use Both
Vault upstream for dynamic infrastructure credentials + AgentSecrets as the agent-facing credential delivery layer. The AgentSecrets proxy can resolve credentials from Vault and inject them at the transport boundary — combining Vault's secret rotation with AgentSecrets' zero-knowledge execution.
