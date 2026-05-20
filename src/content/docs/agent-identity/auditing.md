# Auditing by Agent Identity

Audit logs are the source of truth for all credential access in AgentSecrets. Because credentials are resolved dynamically at the transport layer, the audit log records precisely which agent resolved which key, without ever exposing the key values themselves.

This guide explains how to query, filter, and export audit logs based on Agent Identity.

---

## Filtering logs by agent name

When debugging an integration or conducting a security review, you can filter the audit trail to show only requests made by a specific agent.

### 1. Identify the agent name
Determine the `agent_id` or registered name you want to query (e.g., `billing-processor`).

### 2. Query logs via the CLI
Use the `log list` command with the `--agent` filter:

```bash
agentsecrets log list --agent billing-processor
```

Or watch the logs in real time:

```bash
agentsecrets proxy logs --agent billing-processor --watch
```

### 3. Read the output
The CLI returns the chronological call history for that agent:

```
TIME      RESULT  METHOD  URL                           KEY         STATUS  DURATION
10:14:02  * OK    POST    api.stripe.com/v1/charges     STRIPE_KEY  200     180ms
10:14:05  * OK    GET     api.stripe.com/v1/customers   STRIPE_KEY  200     112ms
```

---

## Filtering logs by identity level

To assess the security posture of your workspace, you can filter logs by the strength of the verification method used. This is useful for detecting systems that are calling credentials without strong cryptographic verification.

* **Find Anonymous Calls**: Locate calls that lack any agent attribution.
  ```bash
  agentsecrets log list --identity anonymous
  ```
* **Find Declared Calls**: Locate calls that report an identity but lack cryptographic signatures.
  ```bash
  agentsecrets log list --identity declared
  ```
* **Find Issued Calls**: Locate calls verified using cryptographic agent tokens.
  ```bash
  agentsecrets log list --identity issued
  ```

---

## Reading per-agent call history

Every audit log entry contains detailed metadata. When queried in JSON format or viewed via the API, a log entry includes:

```json
{
  "id": "log_8a3f9e2d7c",
  "timestamp": "2026-05-20T01:14:02Z",
  "workspace_id": "ws_01hxyz",
  "project_id": "proj_9b1a2c",
  "environment": "production",
  "agent": {
    "id": "billing-processor",
    "level": "issued",
    "token_fingerprint": "8d3f9e2c...1a2b"
  },
  "request": {
    "method": "POST",
    "url": "https://api.stripe.com/v1/charges",
    "headers_injected": ["Authorization"],
    "secrets_resolved": ["STRIPE_KEY"]
  },
  "response": {
    "status_code": 200,
    "duration_ms": 180
  }
}
```

> [NOTE]
> Under no circumstances does the log payload contain the plaintext value or a partial mask of the resolved secret. The audit log only tracks the metadata (e.g., `"secrets_resolved": ["STRIPE_KEY"]`).

---

## Exporting agent-specific logs

For compliance auditing or integration with Security Information and Event Management (SIEM) systems (such as Splunk, Datadog, or AWS CloudWatch), you can export logs programmatically.

### Exporting via the CLI
Export logs directly to a JSON file:

```bash
agentsecrets log list --agent billing-processor --format json > billing_audit.json
```

### Retrieving via the REST API
Ingest logs into your SIEM pipeline using the REST API:

```http
GET /api/audit/logs/?agent_id=billing-processor&format=json HTTP/1.1
Host: api.agentsecrets.com
Authorization: Bearer <your_jwt_token>
```

This endpoint returns a paginated list of JSON log structures, making it simple to write scheduled cron jobs or serverless functions that fetch new logs and stream them to your centralized logging cluster.
