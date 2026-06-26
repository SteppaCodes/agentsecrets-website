# What is AgentSecrets?

AgentSecrets is the **Zero-Knowledge Credential Infrastructure** for the AI agent era. Designed for autonomous agents, development teams, and human-in-the-loop workflows, AgentSecrets moves credentials below the application layer. It ensures that agents can execute tasks using credentials by reference (e.g., `STRIPE_KEY`) without ever seeing raw credential values in their context or process memory.

Rather than a simple secrets manager or proxy, AgentSecrets serves as an **extensible security host** that compiles specialized subsystems into a unified defense-in-depth framework:

| Subsystem / Layer | System | What It Solves | Security Property |
| :--- | :--- | :--- | :--- |
| **Credential Infrastructure** | AgentSecrets (Host) | Agent credential theft & lifecycle management | Credential values are structurally absent from the agent execution context |
| **Capability Bounding Subsystem** | [Keychain-Auth](https://github.com/The-17/keychain-auth) | Static, long-lived, over-privileged credentials | Symmetric keys are cryptographically isolated in daemon memory, bound by process-hash verification to prevent credential access by unauthorized local processes |

Each subsystem represents an independent security primitive. When combined, they guarantee that:
1. **Agents cannot leak credentials** because they never hold them (AgentSecrets Core).
2. **Malicious processes cannot impersonate agents** to retrieve credentials (Keychain-Auth Subsystem).

---

## The Problem AgentSecrets Solves

Every secrets tool built before the agentic era was designed around a reasonable assumption: the application retrieving credentials is trusted. Store the credential securely, retrieve it at runtime, and use it. That model worked because applications do exactly what their code says.

AI agents are different. A coding assistant reading your codebase can also read your `.env` file. An agent deployed into production processes untrusted content and can be redirected by instructions embedded in that content — prompt injection. The moment a credential value exists anywhere in the agent's context, whether in memory, in a file it can read, or in an environment variable it can access, it is reachable.

AgentSecrets removes the value from that space entirely. The agent passes a key name. The infrastructure resolves the real value from the OS keychain and injects it at the transport layer. The agent receives the API response. The value existed in memory for the milliseconds required to make the HTTP request and nowhere else.

---

## Extensible Subsystem Architecture

AgentSecrets acts as a secure platform hosting modular security capabilities:

### 1. Zero-Knowledge Credential Core

:::step
Provides secure storage (delegated to OS Keychain), client-side encrypted cloud sync, environment switching (development, staging, production), and automated response redaction to prevent secret exposure in LLM traces or logs.
:::

### 2. Capability Bounding via Keychain-Auth

:::step
Integrates directly with the OS security layers, verifying the cryptographic hash and identity of any process attempting to resolve secrets. It restricts credential access to explicitly authorized tools and limits sessions using time-bound capabilities.
:::

---

## Execution Modes

AgentSecrets provides four core execution paths depending on your workflow:

1. **The Credential Proxy (for AI Agents)**: Intercepts HTTP/HTTPS requests at the transport layer, resolving key names from the OS keychain and injecting credential values on the fly. This prevents credentials from entering the agent's context or memory.
2. **Environment Injection (for Developers & CLI Tools)**: Runs tools, scripts, or servers using `agentsecrets env -- <command>`. This injects secrets directly into the process environment variables at runtime without writing them to disk (replacing `.env` files completely).
3. **Direct CLI Calls (for Quick Tests)**: Use `agentsecrets call` to make one-shot authenticated requests from the command line. The proxy resolves the key and injects the credential for a single request without needing to start the background proxy daemon.
4. **MCP Server (for AI Assistant Integrations)**: Use `agentsecrets mcp install` to register a Model Context Protocol server. AI coding assistants like Cursor and Claude Desktop can resolve credentials through the same zero-knowledge pipeline using tool calls.

These execution paths ensure credentials never leave your environment as plaintext.

---

## How It Fits Into Your Stack

AgentSecrets sits directly between your AI agent (or execution environment) and the external APIs it calls. It acts as the security infrastructure, intercepting outbound requests, validating local session tokens, evaluating agent capabilities, validating domain and secret-level policies, and injecting keys securely at the transport layer.

```mermaid
flowchart TD
    A["Agent Request (Key Names, agt_Token)"] --> B["Verify Local Pre-Shared Session Token (X-AS-Session-Token)"]
    B --> C["Verify Agent Capabilities (Token Whitelist/Blacklist)"]
    C --> D["Evaluate Secret-Level Policy (Allowed Domains/Methods/Approvals)"]
    D --> E["SSRF & DNS Rebinding Defenses"]
    E --> F["Check Domain Allowlist"]
    F --> G["Keychain-Auth Process Hash Validation"]
    G --> H["Resolve Decrypted Secret (OS Keychain)"]
    H --> I["Inject Credential & Forward Outbound Request"]
    I --> J["Receive Upstream Response"]
    J --> K["Response Redaction & Security Scan"]
    K --> L["Append Cryptographically Chained Entry to audit.db"]
    L --> M["Clean Response to Agent"]
```

## License

MIT. The CLI, proxy, Python SDK, and MCP template are free to use, fork, and modify. See the [repository](https://github.com/The-17/agentsecrets) for the full license.

