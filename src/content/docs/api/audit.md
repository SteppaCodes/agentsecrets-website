# Audit Logs

Centralized audit logging is essential for compliance and security governance. The AgentSecrets API collects redacted access logs sent by local credential proxies, allowing workspace administrators to monitor credential usage.

---

## Log Syncing

The local credential proxy logs every request it intercepts. These logs are stored in a local SQLite database and synchronized to the cloud on-demand or immediately after request execution.

* **Endpoint**: `POST /api/internal/audit/logs/`
* **Security & Redaction**: The proxy redacts all credentials and sensitive authorization headers before transmitting logs to the backend. The API never receives or stores plaintext tokens.
* **Payload Structure**: The API accepts a single log object or an array of log objects directly (not wrapped in a `"logs"` key).
  ```json
  [
    {
      "timestamp": "2026-05-19T22:00:00Z",
      "environment": "development",
      "agent_id": "Claude-Codebase-Assistant",
      "identity_level": "agent",
      "method": "POST",
      "target_url": "https://api.stripe.com/v1/charges",
      "target_path": "/v1/charges",
      "target_domain": "api.stripe.com",
      "status_code": 200,
      "duration_ms": 145,
      "redacted": true,
      "credential_ref": "STRIPE_KEY",
      "injection_style": "header"
    }
  ]
  ```

---

## Accessing Audit Logs

Administrators can retrieve, filter, and export synced audit logs from the cloud.

* **List Logs**: `GET /api/audit/logs/`
  * Requires `workspace_id` parameter.
  * Supports filters for `project_id`, `environment`, `agent_id`, `domain`, `method`, `status_code`, and date ranges (`since`/`until`).
* **Log Detail**: `GET /api/audit/logs/{log_id}/`
* **Log Summary**: `GET /api/audit/summary/` (Returns aggregated metrics, e.g., totals, most active agents, domains, and credentials).
* **Export Logs (JSONL)**: `GET /api/audit/export/` (Generates a streaming JSONL download for external SIEM integration. Requires `workspace_id` and parameter `format=jsonl`).
