# Audit Log Detail Schema

The AgentSecrets audit log is heavily structured to guarantee zero-knowledge compliance. There is no `value`, `credential`, or `plaintext` field in the schema.

---

## The JSON Schema

When you export logs via webhooks, or inspect the local `.agentsecrets/logs/` buffer, the events follow this exact JSON schema:

```json
{
  "eventId": "evt_8a7b6c5d",
  "timestamp": "2026-05-20T14:23:01Z",
  "workspaceId": "ws_1aB9cDef",
  "projectId": "prj_9x2bVxyz",
  "environment": "production",
  
  "agentIdentity": {
    "tokenId": "ws01hxyz_9988",
    "name": "billing-agent"
  },
  
  "request": {
    "method": "GET",
    "targetDomain": "api.stripe.com",
    "targetPath": "/v1/balance",
    "injectedKey": "STRIPE_KEY",
    "injectionStyle": "bearer"
  },
  
  "response": {
    "statusCode": 200,
    "durationMs": 245,
    "proxyResult": "success",
    "blockReason": null
  }
}
```

---

## Schema Field Breakdown

### Request Metadata
- `targetDomain`: The domain the agent attempted to reach. If this domain is not on your workspace allowlist, the proxy terminates the request immediately.
- `injectedKey`: The name of the secret requested by the agent (e.g. `STRIPE_KEY`). 
- `injectionStyle`: How the secret was inserted into the transport layer (e.g., `bearer`, `header`, `query`).

### Response Metadata
- `proxyResult`: Can be `success`, `blocked_domain`, `missing_secret`, or `invalid_identity`.
- `blockReason`: Provides a human-readable explanation if `proxyResult` is not `success`.

> [IMPORTANT]
> The proxy logs the HTTP response `statusCode` it receives from the upstream provider, but it **never** logs the upstream response body or the downstream request body. This prevents PII or sensitive payload data from entering the AgentSecrets audit trail.
