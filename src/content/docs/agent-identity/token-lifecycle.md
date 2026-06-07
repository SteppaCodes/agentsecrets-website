# Token Lifecycle

Managing the lifecycle of Agent Identity Tokens is critical to maintaining a secure least-privilege posture. AgentSecrets provides commands to inspect active tokens, trace when they were last used, and revoke them instantly without causing downtime for other running agents.

---

## Listing tokens per agent

You can list all tokens issued for a specific agent name to monitor active connections and track their activity.

### 1. Run the list command
:::step
Use the `agent token list` command, specifying the target agent's name:

```bash
agentsecrets agent token list "billing-processor"
```
:::

### 2. Inspect active connections
:::step
The CLI returns a table displaying metadata for all tokens associated with that agent:

```
ID            CREATED               LAST USED             STATUS
tok_7f9b8c2d  2026-05-18 10:00:00   2026-05-20 01:10:00   active
tok_9a2b3c4d  2026-05-19 12:00:00   2026-05-20 01:12:00   active
```

* **ID**: The unique, public identifier of the token (`token_id`). This ID is safe to share and is used for revocation.
* **CREATED**: The timestamp when the token was generated.
* **LAST USED**: The timestamp when the credential proxy last authenticated a request using this token.
* **STATUS**: The current state of the token (e.g., `active` or `revoked`).
:::

---

## Revoking a specific token

If a token is exposed, or if a container or VM hosting an agent is terminated, you must revoke the token immediately.

### 1. Identify the Token ID
:::step
Run `agentsecrets agent token list` to identify the ID of the token you wish to revoke (e.g., `tok_7f9b8c2d`).
:::

### 2. Execute the revocation command
:::step
Run the `revoke` command with the token ID and agent name:

```bash
agentsecrets agent token revoke tok_7f9b8c2d --agent="billing-processor"
```
:::

### 3. Verify revocation
:::step
List the tokens again to ensure the status is updated or the token is removed:

```bash
agentsecrets agent token list "billing-processor"
```

Behind the scenes, this command calls the backend REST API:
```http
DELETE /api/workspaces/{workspace_id}/agents/{registration_id}/tokens/tok_7f9b8c2d/ HTTP/1.1
Host: api.agentsecrets.com
Authorization: Bearer <user_session_jwt>
```
Once executed, the token ID is blocklisted. The proxy syncs this blocklist within seconds, and any subsequent API calls using the revoked token will fail with a `401 Unauthorized` status.
:::

---

## Revoking without touching other agents

A core design feature of AgentSecrets is **isolation**. Because agent identities are token-based, rather than relying on shared environment-wide API keys, revocation is surgical:

```mermaid
graph TD
    A[Agent Workspace] --> B[billing-processor Agent]
    B --> C[Token 1: tok_7f9b8c2d - Pod A]
    B --> D[Token 2: tok_9a2b3c4d - Pod B]
    
    C -->|Revoked| E(Blocked by Proxy)
    D -->|Active| F(Allowed by Proxy)
```

If you have five instances of a billing agent running across five Kubernetes pods, each pod should use its own unique agent token. 
* If Pod A is compromised, you revoke `tok_7f9b8c2d`.
* Pod A is immediately locked out of resolving secrets.
* Pods B, C, D, and E continue resolving secrets and processing transactions without interruption.
* You do not need to redeploy the other pods, change their environment variables, or rotate the root workspace secrets.

---

## Token Expiry (TTL)

To limit the lifespan of issued tokens and enforce regular rotation, you can specify an expiration time when registering an agent or issuing a token using the `--expires` (or `-e`) flag:

```bash
# Set token to expire in 30 days during registration
agentsecrets agent register "billing-processor" --expires 30d

# Set token to expire in 7 days when issuing a new token
agentsecrets agent token issue "billing-processor" --expires 7d
```

The CLI supports durations in days (e.g., `7d`, `30d`, `90d`). The proxy will check the token's expiration timestamp during validation. If a token is expired, the proxy immediately blocks the request and logs an expired audit event.

---

## Roadmap

The following lifecycle features are on the active product roadmap:

1. **Automatic Rotation SDKs**: Out-of-the-box support in the SDK to dynamically exchange expiring tokens in the background without process restarts.
2. **Idle Token Auto-Deactivation**: A workspace-level policy that automatically revokes any token that has not made a call to the proxy within a configurable window (e.g., 30 days).
