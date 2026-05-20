# Agent Identity

In a single-agent workflow, knowing that a call was made is usually enough. In a multi-agent workflow where multiple agents run simultaneously, share the same secrets, and make overlapping calls, you need to know which agent made each specific call.

Agent identity lets you attribute every proxied call to a specific agent, filter audit logs by agent, and revoke access for one agent without affecting any others.

---

## Why agent identity matters

Consider a production environment with three agents: one processing payments, one sending emails, one generating reports. All three share the same workspace and have access to the same secrets. Something goes wrong — a large number of unexpected API calls appear in the audit log.

Without agent identity, you know what was called and when, but not which agent made the calls. With issued identity, every log entry is attributed to a specific agent. You can immediately see which agent made the unexpected calls, revoke its token without touching the others, and continue operating while you investigate.

---

## The three identity levels

AgentSecrets supports three levels of agent identity with increasing strength of attribution and control.

### Anonymous

The default. Calls are made and logged without any agent attribution. The audit log records that a call happened, but not which agent made it. Suitable for single-agent setups, scripts and one-off tools, and development, also useful for spotting gaps in your identity coverage.

The risk in a multi-agent system: anonymous calls create coverage gaps. You cannot attribute incidents to specific agents, and you cannot revoke access for one agent without stopping them all. the call is logged as `anonymous`, you can find anonymous calls in the audit log with:

```bash
agentsecrets log list --identity anonymous
```

### Declared identity

A declared identity is a name you assign to an agent when you make a cal. The name is recorded in every audit log entry for that agent's calls. There is no cryptographic verification, if an agent claims to be `"billing-processor"`, it is taken at its word.

:::tabs

### CLI

```bash
agentsecrets call \
  --url https://api.stripe.com/v1/balance \
  --bearer STRIPE_KEY \
  --agent-id billing-processor

```

### Python SDK
```python
from agentsecrets import AgentSecrets

client = AgentSecrets(agent_id="billing-processor")

response = client.call(
    url="https://api.stripe.com/v1/balance",
    bearer="STRIPE_KEY"
)
```

### HTTP Proxy
```
curl http://localhost:8765/proxy \
  -H "X-AS-Target-URL: https://api.stripe.com/v1/balance" \
  -H "X-AS-Inject-Bearer: STRIPE_KEY" \
  -H "X-AS-Agent-ID: billing-processor"
```


Declared identity is suitable for multi-agent systems where audit log clarity matters but you trust the agents running and do not need per-token revocation.

### Issued identity

An issued identity is cryptographically verified on every call. You issue a token for a named agent and the proxy verifies the token signature on every request. Attribution is cryptographic, a call attributed to `"billing-processor"` can only have come from a process holding that token.

#### Issuing a token

```bash
# Issue a token
agentsecrets agent token issue "billing-processor"
# → agt_ws01hxyz_4kR9mNpQ...
# Shown once, store it securely immediately
```

#### Using the token

:::tabs 

### Python SDK
```python
client = AgentSecrets(agent_token="agt_ws01hxyz_4kR9mNpQ...")
```

### HTTP Proxy
```bash
curl http://localhost:8765/proxy \
  -H "X-AS-Target-URL: https://api.stripe.com/v1/balance" \
  -H "X-AS-Inject-Bearer: STRIPE_KEY" \
  -H "X-AS-Agent-Token: agt_ws01hxyz_4kR9mNpQ..."
```


Use issued identity for production multi-agent systems, agents with access to sensitive secrets, and any situation where you need to revoke a single agent's access immediately.

---

## How identity flows into the audit log

Every proxy call produces an audit log entry. The identity fields in that entry depend on the identity level used:

| Identity level | `agent_id` field | `agent_identity_level` field |
|---|---|---|
| Anonymous | `null` | `"anonymous"` |
| Declared | `"billing-processor"` | `"declared"` |
| Issued | `"billing-processor"` | `"issued"` |

For issued identity, the log entry is cryptographically tied to the specific token used. If that token is later revoked, the historical entries remain, you can still see what that agent did before revocation.

---

## Token-based identity explained

Issued tokens are cryptographically signed at the workspace level. When the proxy receives a request with an agent token, it verifies the token's signature before processing the request. Invalid or revoked tokens are rejected immediately, the proxy returns 401 and logs the attempt.

Tokens are individual. Revoking one token has no effect on other tokens issued to the same agent or to different agents:

```bash
# Issue multiple tokens for the same agent (e.g., multiple instances)
agentsecrets agent token issue "billing-processor"
# → agt_ws01hxyz_token1...

agentsecrets agent token issue "billing-processor"
# → agt_ws01hxyz_token2...

# Revoke one, the other continues working
agentsecrets agent token revoke <token-id> --agent="billing-processor"
```

This makes it safe to rotate access for a single agent instance without disrupting others.

## Managing agent tokens

You can list and revoke tokens using the following commands:

```bash
# List all tokens for the current workspace
agentsecrets agent token list

# Revoke a specific token
agentsecrets agent token revoke <token-id>
```

## Deleting an agent
Deleting an agent cascade-revokes all tokens issued to it in one operation:

```bash
agentsecrets agent delete "billing-processor"
```

After deletion, every token issued to that agent is immediately invalidated. Calls using any of those tokens will be rejected by the proxy.

> [WARNING]
> Deleting an agent is irreversible. All tokens are revoked immediately. Any process using a token for that agent will lose proxy access.

---

## Choosing an identity level

| Situation | Recommended level |
|---|---|
| Single agent, development | Anonymous |
| Multiple agents, want audit clarity | Declared |
| Production, sensitive secrets | Issued |
| Need to revoke one agent immediately | Issued |
| Compliance, cryptographic attribution required | Issued |
