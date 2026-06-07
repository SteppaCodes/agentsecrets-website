# Reading and Auditing Logs

AgentSecrets provides multiple log categories and tools to monitor credential calls, track administrative changes, inspect running daemon states, and analyze security snapshots for debugging.

---

## 1. Interactive Proxy Audit Log (`agentsecrets log`)

The `agentsecrets log` command opens an interactive, paginated terminal log viewer. It displays the history of API requests routed through the local credential proxy.

### Interactive Controls

:::step
* **Pagination**: Logs are displayed in pages of 20. Press `n` to go to the next page and `p` to go to the previous page.
* **Detailed View**: Type the number of any row (e.g. `1` to `20`) and press **Enter** to open a detailed breakdown of that specific log entry. If a Forensic log is selected, this displays the full trace of event blocks, enforcement layers, snapshots, and resolution statuses.
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

## 2. Inspecting Log Details (`agentsecrets log show <id>`)

To inspect a single log record by ID:
```bash
agentsecrets log show log_a1b2c3d4
```

For forensic logs, this prints a full component trace:
* **Event Details**: Request details, status code, outcome, latency, and agent process verification.
* **Enforcement Layer Trace**: chronological evaluation results across Capabilities, Allowlist, and Secret Policies.
* **Resolution Layer**: Injection style, SSRF checks, and response redaction status.
* **Snapshot State**: The active database size, allowlist domains, project info, and active capabilities policies at execution time.

---

## 3. Cryptographic Chain Verification (`agentsecrets log verify`)

Because AI agents write and execute code dynamically, proving the integrity of the audit logs is essential for SOC 2 and ISO 27001 compliance. 

The `log verify` command validates the mathematical signature of the entire chronological SQLite log chain:

```bash
agentsecrets log verify
```

### How it works
The verify command walks the logs oldest-to-newest, recalculates the SHA-256 hash for each row (incorporating the previous row's ID and current timestamp), and asserts that it matches the recorded `chain_hash`.

* **Success State**:
  ```
  Verifying cryptographic chain integrity...
  Chain integrity: OK
  Successfully verified 142 logs in the chain.
  ```
* **Tampered State** (if a log was deleted, updated, or reordered):
  ```
  Verifying cryptographic chain integrity...
  FAIL: Chain integrity failure detected at index 45!
    Log ID:        log_a1b2c3d4
    Created At:    2026-06-07T12:00:00Z
    Recorded Hash: a4f7831...
    Expected Hash: f983d2a...
    Previous ID:   log_z9y8x7w6
  Error: cryptographic audit log verification failed
  ```

---

## 4. Visual State Replay (`agentsecrets log replay <id>`)

If a request was blocked or redacted and you need to investigate *why*, you can reconstruct the exact environment state using the visual replay tool:

```bash
agentsecrets log replay log_a1b2c3d4
```

This renders a step-by-step evaluation breakdown of the three active security layers:

```
─────────────────────────────────────────────────────────
REPLAY STATE FOR EVENT log_a1b2c3d4
─────────────────────────────────────────────────────────
Timestamp:   2026-06-07 12:00:00.000 MST
Action:      POST https://api.stripe.com/v1/charges
Environment: production

[1/3] Evaluated Agent Capabilities
  Agent Token:      billing-agent
  Allowed Projects: proj_billing
  Allowed Secrets:  STRIPE_KEY
  Active Scopes:    proxy_call
  Result:           PASS (Agent has permission to use this key)

[2/3] Evaluated Workspace Allowlist
  Target Domain:    api.stripe.com
  Allowlist count:  2 domains allowed
  Allowlist:        api.stripe.com, api.openai.com
  Result:           PASS (api.stripe.com is permitted by allowlist)

[3/3] Evaluated Secret Policies
  Injected Secret:  STRIPE_KEY
  Active Policy:    Yes (allowed domains: api.stripe.com, methods: GET, action: request_permission)
  Result:           FAIL (Secret 'STRIPE_KEY' requires approval for POST to api.stripe.com)

─────────────────────────────────────────────────────────
FINAL ENFORCEMENT DECISION SUMMARY
─────────────────────────────────────────────────────────
Final Decision:   POLICY_DENIED
Decided By:       secrets_policy
Credential State: Not injected
Response Redact:  No redaction
─────────────────────────────────────────────────────────
```

---

## 5. Static Proxy Audit Log (`agentsecrets proxy logs`)

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

## 6. Live Log Streaming (`agentsecrets log watch`)

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

## 7. Workspace Allowlist Logs (`agentsecrets workspace allowlist log`)

Workspace logs provide an audit trail of administrative configuration changes inside your workspace rather than API proxy calls. They record when domains were added or removed from the proxy allowlist, and which user authorized the change.

```bash
# View the list of allowlist modifications
agentsecrets workspace allowlist log
```

---

## 8. Proxy Daemon Status (`agentsecrets proxy status`)

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

## 9. Keychain Auth Security Daemon Audit Log

While the proxy audit log records runtime API calls, the local `keychain-auth` daemon maintains its own security audit log. This log is crucial for tracking low-level operating system credentials access and process validations.

### Log File Location
Depending on your operating system, the `keychain-auth` audit log is stored at:
* **Linux/macOS**: `~/.local/share/keychain-auth/audit.log`
* **Windows**: `%USERPROFILE%\AppData\Local\keychain-auth\audit.log`

### What it records
Every time an application, script, or AI tool attempts to communicate with the AgentSecrets keychain helper, the secure daemon logs:
1. **Request Origin**: The calling Process ID (PID) and binary path.
2. **Process Hash Verification**: Whether the calling binary's SHA-256 hash matched authorized code signatures (anti-impersonation check).
3. **Session Binding**: Creation and expiration of session-bound permissions.
4. **Access Outcome**: Whether the request to retrieve or set credentials in the native OS Keychain was permitted or rejected.

You can inspect this log file directly using standard command-line tools:
```bash
# View the last 50 daemon security checks
tail -n 50 ~/.local/share/keychain-auth/audit.log
```
