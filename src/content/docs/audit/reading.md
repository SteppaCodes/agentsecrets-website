# Reading and Auditing Logs

AgentSecrets provides multiple log categories and tools to monitor credential calls, track administrative changes, inspect running daemon states, and analyze security snapshots for debugging.

---

## 1. Interactive Proxy Audit Log (`agentsecrets log`)

The `agentsecrets log` command opens an interactive, paginated terminal log viewer. It displays the history of API requests routed through the local credential proxy.

### Interactive Controls

:::step
* **Pagination**: Logs are displayed in pages of 20. Press `n` to go to the next page and `p` to go to the previous page.
* **Detailed View**: Type the number of any row (e.g. `1` to `20`) and press **Enter** to open a detailed breakdown of that specific log entry, including workspace, agent token, capabilities, duration, and target headers.
* **Exit**: Press `q` to quit the interactive log viewer.
:::

### Filtering Logs

You can apply various filters to target specific environments, agents, or endpoints:

```bash
# Filter by a specific agent registration name
agentsecrets log --agent "billing-processor"

# Filter by verification level (anonymous, declared, issued)
agentsecrets log --identity anonymous

# Filter by a specific agent token ID
agentsecrets log --token tok_7f9b8c2d

# Filter by a specific credential key name
agentsecrets log --credential STRIPE_KEY

# Filter by target domain, HTTP method, or status class
agentsecrets log --domain api.stripe.com --method POST --status-class 4xx

# Filter by environment and time window
agentsecrets log --env production --since 24h
```

---

## 2. Static Proxy Audit Log (`agentsecrets proxy logs`)

If you want to quickly print the most recent log entries directly to stdout without entering the interactive viewer (for example, to pipe to another tool or check recent history quickly), use `agentsecrets proxy logs`.

```bash
# Print the last 50 log entries (default is 20)
agentsecrets proxy logs --last 50

# Filter by a specific secret key name
agentsecrets proxy logs --secret STRIPE_KEY

# Filter by environment
agentsecrets proxy logs --env staging
```

---

## 3. Live Log Streaming (`agentsecrets log watch`)

To stream audit logs in real-time as your applications or AI agents execute requests:

:::step
Run the watch command to live stream incoming entries:
```bash
agentsecrets log watch
```

Alternatively, you can run the list command with the tail flag:
```bash
agentsecrets log --tail
```
:::

---

## 4. Workspace Allowlist Logs (`agentsecrets workspace allowlist log`)

Workspace logs provide an audit trail of administrative configuration changes inside your workspace rather than API proxy calls. They record when domains were added or removed from the proxy allowlist, and which user authorized the change.

```bash
# View the list of allowlist modifications
agentsecrets workspace allowlist log
```

This returns a table showing:
* **ACTION**: `added` or `removed`.
* **DOMAIN**: The target API domain.
* **USER**: The administrator who performed the action.
* **TIMESTAMP**: When the action was recorded.

---

## 5. Proxy Daemon Status (`agentsecrets proxy status`)

To check the operational health of the background proxy process, view its memory usage, sync intervals, and log file sizes:

```bash
agentsecrets proxy status
```

This command displays:
* **Proxy Status**: `running` or `not running`.
* **PID & Port**: The system Process ID and listening port (default `8765`).
* **Uptime**: How long the proxy daemon has been running.
* **Last Sync**: The time since the proxy last synchronized its revocation blocklists with the cloud backend.
* **Audit DB Path**: The local SQLite database path (default `~/.agentsecrets/audit.db`).
* **Database Size**: The exact size and last modified time of the SQLite log file.

---

## 6. Governance Logs (Snapshots & Debugging)

Every audit log entry contains embedded **policy and allowlist snapshots** captured at the exact millisecond the request was executed. This is critical for auditing and debugging access control violations.

:::step
* **Allowlist Snapshots**: The log records the complete list of authorized domains (`allowlist_snapshot`) active at the time of the request. If a request was blocked due to a missing domain, you can inspect the snapshot to confirm what domains were allowed.
* **Policy Snapshots**: The log records the active agent capability policy ID (`policy_snapshot_id`). This lets you verify which capabilities were bound to the agent token when a request was executed.
* **Response Redaction**: If the target API echoed a credential back in the response body, the proxy scrubs the value, sets `redacted = true`, and logs a redaction reason.
:::

To output the full governance JSON log records including these snapshots, run:
```bash
agentsecrets log --json --verbose
```
