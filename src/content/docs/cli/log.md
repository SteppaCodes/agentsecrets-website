# log

## agentsecrets log list
```bash
agentsecrets log list
agentsecrets log list --tail
agentsecrets log list --agent NAME
agentsecrets log list --identity anonymous
```
Views the global backend audit log. `--tail` streams live. `--agent` filters by agent name. `--identity anonymous` finds calls with no agent identity set.

## agentsecrets log summary
```bash
agentsecrets log summary
agentsecrets log summary --since 7d
```
Aggregate statistics: call counts, top keys, top agents, error rates.

## agentsecrets log export
```bash
agentsecrets log export --format csv
agentsecrets log export --format json --since 30d
```
Exports audit log entries for compliance review or external analysis.

## agentsecrets log show
```bash
agentsecrets log show <log_id>
```
Full detail for a specific forensic log entry, including the domain allowlist snapshot, capabilities snapshot, and secrets policy snapshot at the time of the call.

## agentsecrets log verify
```bash
agentsecrets log verify
```
Verifies the cryptographic chain integrity of all forensic audit log entries stored in the local SQLite database. It recalculates the SHA-256 hash chains between sequential entries to detect any unauthorized modifications or deletions.

Output:
```
Verifying cryptographic chain integrity...
Chain integrity: OK
```

## agentsecrets log replay
```bash
agentsecrets log replay <log_id>
```
Replays the evaluation and decision logs of a specific proxy request. This walks through all evaluation layers (Agent Capabilities, Workspace Allowlist, and Secret-level Policies) to explain why a request succeeded or was blocked.

Sample Output:
```
─────────────────────────────────────────────────────────
REPLAY STATE FOR EVENT log_01J0A...
─────────────────────────────────────────────────────────
Timestamp:   2026-06-10 22:09:25.000 UTC
Action:      GET https://httpbin.org/get
Environment: development

[1/3] Evaluated Agent Capabilities
  Agent Token:      test-agent3
  Allowed Projects: proj-1, proj-2
  Allowed Secrets:  API_KEY, OTHER_KEY
  Active Scopes:    read, write
  Result:           PASS (agent capabilities check passed)

[2/3] Evaluated Workspace Allowlist
  Target Domain:    httpbin.org
  Allowlist count:  2 domains allowed
  Allowlist:        httpbin.org, api.stripe.com
  Result:           PASS (Domain httpbin.org is permitted by allowlist)

[3/3] Evaluated Secret Policies
  Injected Secret:  API_KEY
  Active Policy:    None (No restrictions on this key)
  Result:           PASS (no active policy set on this secret)
```

