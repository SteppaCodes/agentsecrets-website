# Exporting Audit Logs

For compliance, offline analysis, or enterprise SIEM ingestion, AgentSecrets allows you to export your proxy call logs and forensic audit records. Since AgentSecrets operates on a zero-knowledge architecture, no plaintext credential values are ever written to the logs. You can safely export and ingest these logs without risking credential leakage.

---

## Export Methods

### 1. Local CLI Export
:::step
You can export logs stored in your local SQLite database directly to a CSV or newline-delimited JSON (JSONL) file using the CLI:

```bash
# Export the last 7 days of logs to a CSV file
agentsecrets log export --since 7d --format csv --output ~/audit_export.csv

# Export all logs for a specific agent to a JSONL file
agentsecrets log export --since 30d --agent "billing-processor" --format jsonl --output ~/billing_logs.jsonl
```

The CLI export supports filters such as `--agent` and `--credential` to scope your export files.
:::

### 2. Cloud Server & API Export
:::step
If your CLI is connected to the AgentSecrets synchronization server, you can export your workspace's global audit logs via the Cloud Dashboard or programmatically via the HTTP API:

```bash
# Retrieve workspace logs in JSONL format using the API
curl -H "Authorization: Bearer <your_auth_token>" \
     "https://api.agentsecrets.theseventeen.co/api/audit/export/?workspace_id=<workspace_id>&format=jsonl" \
     -o workspace_audit.jsonl
```
:::

---

## Log Payload Schemas

Exported logs contain the standard audit log parameters. If you export in JSONL format, each line corresponds to an audit entry. For details on the specific fields exported, refer to the [Audit Detail Schema](detail.md).
