# logs

AgentSecrets provides a comprehensive, secure, and tamper-proof auditing engine to track credential operations across your local machine and your shared workspaces.

## Command Reference

### `agentsecrets logs list`
```bash
agentsecrets logs list
agentsecrets logs list --tail
agentsecrets logs list --agent NAME
agentsecrets logs list --identity anonymous
```
Lists the credential call audit logs. `--tail` streams live entries. `--agent` filters by a specific agent name. `--identity anonymous` finds calls with no agent identity set.

### `agentsecrets logs summary`
```bash
agentsecrets logs summary
agentsecrets logs summary --since 7d
```
Displays aggregated statistics of secret usage, including call counts, top keys, top active agents, and error rates.

### `agentsecrets logs export`
```bash
agentsecrets logs export --format csv
agentsecrets logs export --format json --since 30d
```
Exports audit log entries for external compliance review (e.g. SOC 2 or ISO 27001).

### `agentsecrets logs show`
```bash
agentsecrets logs show <log_id>
```
Displays full forensic details for a specific log entry, including the domain allowlist snapshot, active capabilities, and secrets policy configuration at the millisecond of execution.

### `agentsecrets logs verify`
```bash
agentsecrets logs verify
```
Verifies the cryptographic chain integrity of all forensic audit log entries stored in the local SQLite database. It recalculates the SHA-256 hash chains between sequential entries to detect any unauthorized modifications or deletions.

### `agentsecrets logs replay`
```bash
agentsecrets logs replay <log_id>
```
Replays the evaluation layers of a specific request, showing exactly why a request was permitted, blocked, or redacted.

---

## Workspace & Project Scoping

All `agentsecrets logs` commands are implicitly scoped to your **active workspace** (configured via `agentsecrets workspace switch`). 

To filter logs for a specific project within that workspace, use the `--project` flag on any logs command:
```bash
agentsecrets logs list --project payments-service
agentsecrets logs summary --project content-pipeline
```

---

## Logging Systems Explained

AgentSecrets separates operational logging from security compliance auditing:

| Feature | Audit Logs (`agentsecrets logs`) | Proxy Daemon Logs (`agentsecrets proxy logs`) | Allowlist Logs (`workspace allowlist log`) |
|---|---|---|---|
| **Purpose** | Compliance auditing (SOC 2, ISO 27001) | Live operational state & routing | Tracking admin changes to allowlist |
| **Tracked Info** | Resolved keys, target domains, redaction, status | Port bindings, incoming connections, sync events | Added/removed domains, author, timestamp |
| **Plaintext Secrets** | **No** (Only key names and hashes) | **No** | **No** |
| **Storage (Local)** | SQLite database (`~/.agentsecrets/audit.db`) | Local temp log file | N/A |
| **Storage (Server)** | Database `audit_logs` table (Shared workspaces) | N/A | Database `WorkspaceAllowlistLog` table |
| **Immutability** | Cryptographic hash chaining (SHA-256) | Standard text rotation | Standard DB record logging |
