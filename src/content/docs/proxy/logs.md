# Governance Audit Logs

Every AgentSecrets proxy call is logged. The operational proxy daemon logs (`agentsecrets proxy logs`) track local daemon runtime events and connections. The governance audit logs (`agentsecrets logs`) show the cryptographically verified access logs with complete context.

## What the governance log records

Every entry captures:

- Timestamp
- Agent identity and identity level
- Active environment at time of call
- Credential reference (key name, never value)
- Injection style
- Target domain and full URL
- HTTP method
- Response status code
- Duration in milliseconds
- Whether response redaction occurred
- Domain allowlist snapshot — the exact state of the allowlist at the moment of the call, not the current state

The allowlist snapshot is important for forensics. If the allowlist changes after an incident, historical entries still show what was authorized at the time of the call. The governance log is forensically complete.

## Querying the governance log

```bash
# Stream live logs
agentsecrets logs list --tail

# Filter by agent
agentsecrets logs list --agent billing-processor

# Find anonymous calls — gaps in identity coverage
agentsecrets logs list --identity anonymous

# Aggregate statistics for the last 7 days
agentsecrets logs summary --since 7d

# Export for compliance review
agentsecrets logs export --format csv --since 30d

# Inspect a specific entry in full detail
agentsecrets logs show <entry-id>
```

---

## Workspace & Project Scoping

All `agentsecrets logs` commands are implicitly scoped to your **active workspace** (configured via `agentsecrets workspace switch`). If the workspace is **Shared**, the CLI pulls workspace-wide logs from the central server. If the workspace is **Personal**, it reads them from the local SQLite audit database (`~/.agentsecrets/audit.db`).

To filter logs for a specific project within that active workspace, use the `--project` flag on any logs command:
```bash
agentsecrets logs list --project payments-service
agentsecrets logs summary --project content-pipeline
```

---

## What is never in the log

There is no value field in the audit log schema. It is not a field that is populated with empty strings or null, the field does not exist. You cannot accidentally log a credential value by misconfiguring the verbosity level or enabling debug mode. The schema makes it structurally impossible.
