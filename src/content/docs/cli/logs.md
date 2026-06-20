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

## Workspace & Project Audit Logs

To view activity scoped specifically to workspaces or projects, use:

### `agentsecrets workspace logs`
```bash
agentsecrets workspace logs
```
Fetches the logs for the active workspace. If the workspace is **Shared**, the CLI pulls workspace-wide logs from the central server. If the workspace is **Personal**, it reads them from the local SQLite audit database.

### `agentsecrets project logs`
```bash
agentsecrets project logs
```
Fetches the logs for the active project. Queries the remote server for **Shared** workspaces and the local SQLite audit database for **Personal** workspaces.

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
