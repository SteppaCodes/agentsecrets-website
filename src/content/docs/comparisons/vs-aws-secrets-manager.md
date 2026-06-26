# AgentSecrets vs AWS Secrets Manager

AWS Secrets Manager is a robust cloud service for storing and retrieving secrets, deeply integrated into the AWS ecosystem (IAM, KMS, Lambda, ECS, EKS).

## Recent Evolution

AWS has made two notable additions since 2025:

**Workload Credentials Provider** (v3.0.0, June 2026): Rebranded from the Secrets Manager Agent. A local HTTP caching sidecar on `localhost:2773` that caches secrets in memory with configurable TTL. Also now handles ACM certificate export/refresh. Open source (Rust).

**AI Agent Secret Safety Skill** (June 17, 2026): Part of the AWS Agent Toolkit. Two layers — (1) guides agents to use `{{resolve:secretsmanager:...}}` dynamic references with `asm-exec`, a wrapper that resolves secrets in a child process; (2) a `PreToolUse` hook that blocks agents from calling `GetSecretValue` directly.

### What These Don't Change

The Workload Credentials Provider is a caching layer, not a credential broker. It holds the decrypted secret in its own memory cache, and any process with the SSRF token can retrieve it. The secret still reaches the application process in plaintext.

The AI Agent Safety Skill is an agent-level guardrail — it tells the agent *not* to read secrets, but does not prevent a compromised or misconfigured agent from bypassing it. It depends on the agent respecting the `PreToolUse` hook, and does not enforce the restriction at the infrastructure level.

Underneath both, `GetSecretValue` still returns the decrypted `SecretString` or `SecretBinary` in the API response. The credential delivery model is unchanged: request-and-receive.

## The Core Architectural Difference

| | AWS Secrets Manager | AgentSecrets |
|---|---|---|
| **Delivery model** | Request-and-receive — agent calls `GetSecretValue`, gets plaintext | Transport-layer injection — agent passes key name, proxy resolves and injects |
| **Agent sees credential** | Yes, in API response | No — credential never enters agent context |
| **Local caching** | In-memory cache (Workload Credentials Provider) | OS keychain (persistent, encrypted at rest) |
| **Per-secret constraints** | IAM policies (coarse, API-level) | Domain + method restrictions (`secrets policy set`) |
| **Agent identity** | IAM roles (instance-level) | Cryptographic tokens per agent (`agent register`) |
| **Process verification** | None (SSRF token-based) | `keychain-auth` daemon (binary hash) |
| **AI agent safety** | Client-side guardrails (agent toolkit hook) | Infrastructure-enforced (proxy blocks injection) |

## Using Them Together

If your enterprise mandates AWS Secrets Manager for storage, you can use AgentSecrets as the credential delivery layer. Store secrets in AWS, then configure the AgentSecrets proxy to resolve from AWS and inject at the transport boundary. Your AI agents benefit from zero-knowledge execution without migrating storage.
