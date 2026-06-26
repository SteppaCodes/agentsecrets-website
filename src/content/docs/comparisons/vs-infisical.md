# AgentSecrets vs Infisical

Infisical is an excellent open-source secrets management platform that has evolved rapidly. In April 2026, Infisical launched **Agent Vault**, a TLS-intercepting MITM forward proxy that prevents AI agents from seeing raw credentials — the same architectural approach AgentSecrets pioneered.

## Honest Assessment

Infisical now offers two delivery mechanisms:

- **`infisical run --`** (traditional): injects secrets as environment variables. The agent process sees plaintext credentials in `os.environ`.
- **Agent Vault** (April 2026): a Go-based forward proxy that injects credentials at the transport layer. The agent never receives the raw secret value — similar to how AgentSecrets works.

This is a genuine convergence. Agent Vault validates AgentSecrets' core thesis: credential brokering, not credential delivery, is the right model for AI agents.

## Where AgentSecrets Still Differs

Despite the architectural convergence, four structural differences remain:

### 1. Identity-Bound Credential Access
Agent Vault is an unauthenticated proxy — any process that can route traffic through it has access to all configured credentials. AgentSecrets binds every credential request to a **cryptographic agent identity** (Level 2: Issued tokens, prefixed `agt_`). Audit logs show which specific agent used which credential, and policies can grant or deny access per agent.

### 2. Secret Constraints (Domain/Method Locking)
AgentSecrets supports per-secret constraints that restrict *where* and *how* a credential can be used. A `STRIPE_KEY` can be locked to `api.stripe.com` with `GET` and `POST` only. If an agent tries to send it elsewhere, the proxy blocks the request — before any credential is injected. Agent Vault requires manual configuration per-service-endpoint without per-secret domain enforcement.

### 3. Process-Level Anti-Impersonation (`keychain-auth`)
AgentSecrets' `keychain-auth` daemon cryptographically verifies the calling binary's SHA-256 hash before releasing any credential. A rogue script or modified CLI binary is denied at the IPC handshake level. Agent Vault does not perform binary-level identity verification.

### 4. Deployment Model
Agent Vault is a research preview (v0.39, API subject to change). AgentSecrets is a production credential infrastructure with OS keychain storage, read-through policy caching, team sync, and environment isolation built in.

## Summary

| Dimension | Infisical + Agent Vault | AgentSecrets |
|---|---|---|
| Credential brokering | Yes (via Agent Vault) | Yes (via proxy + call env) |
| Agent identity binding | None (proxy-wide) | Cryptographic tokens (agt_) |
| Per-secret domain constraints | Manual endpoint config | Built-in (\`secrets policy set\`) |
| Process binary verification | None | `keychain-auth` daemon (SHA-256) |
| Storage | Infisical cloud | OS keychain (local-first) |
| Maturity | Agent Vault: v0.39, research preview | Production |
