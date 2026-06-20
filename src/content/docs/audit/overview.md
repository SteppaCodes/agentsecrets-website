# Forensic Governance & Audit Logging

In traditional systems, audit logging is treated as a simple event stream—recording what happened (e.g., *Agent X called Stripe at 14:22:01, received a 200, took 143ms*). 

For autonomous AI agents, standard event logging is completely insufficient for security and compliance audits. Because AI agents are non-deterministic, dynamic, and execute untrusted inputs, they require a **Forensic Snapshot Log**. 

AgentSecrets implements a full-governance logging system stored locally in SQLite (`~/.agentsecrets/audit.db`) that captures the entire security boundary and system state at the exact millisecond of every request.

---

## Why AI Agents Require Forensic Logging

### 1. Non-Deterministic Behavior
AI agents write code, execute shell commands, and construct API requests on the fly based on LLM reasoning. Standard logs only show the end request; they cannot explain *why* the agent had access to a specific key, or *what* rules were active when the LLM decided to call that endpoint.

### 2. Rapid Context Shifts
The agent's security context—such as domain allowlists, agent capabilities, or secret policies—can shift dynamically during a session. A forensic audit must prove the *exact state of the security boundary* when the call was executed, not hours later when the audit is run.

### 3. Log Tampering & Hijacking
If an agent escapes its sandbox or a machine is compromised, attackers may attempt to delete, insert, or reorder log records to hide malicious API calls (e.g. data exfiltration). Without cryptographic non-repudiation, logs cannot be trusted during post-incident investigations.

### 4. Traceable Multi-Layer Enforcement
To satisfy security administrators and compliance auditors (SOC 2, ISO 27001), you must prove *exactly which firewall layer* authorized or blocked a request. The log must trace evaluations across Agent Capabilities, Workspace Allowlists, and Secret-Level Policies.

---

## The Forensic Log Architecture

AgentSecrets stores all forensic logs locally in a high-performance SQLite database under `~/.agentsecrets/audit.db` within the `forensic_audit_events` table. 

To guarantee log integrity, AgentSecrets implements a **cryptographic chain hash sequence**. Each log entry is mathematically linked to the entry before it:

```
chain_hash = SHA-256(previous_entry_id + current_entry_id + created_at_RFC3339)
```

* **Immutable History**: If an attacker modifies a row's details, deletes an entry, or tries to reorder logs, the hash chain breaks.
* **Non-Repudiation**: Running `agentsecrets logs verify` walks the chain chronologically, recalculates the hashes, and flags any discrepancy instantly.
* **Zero Credential Exposure**: No plaintext credential values are ever written to the database. Only key names (e.g., `STRIPE_KEY`) and metadata are recorded.

---

## Schema Component Blocks

Every forensic log entry is divided into four highly structured, immutable JSON blocks alongside flat indexable columns:

```
┌──────────────────────────────────────────────────────────────────┐
│                      ForensicAuditEvent                          │
│                                                                  │
│  Flat Fields: id, version, created_at, workspace_id, project_id, │
│               environment, agent_id, token_id, domain, method,   │
│               status_code, outcome, latency_ms, chain_hash       │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │    Event Block   │  │  Snapshot Block  │  │Enforcement Block│ │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘ │
│                                                                  │
│                        ┌──────────────────┐                      │
│                        │ Resolution Block │                      │
│                        └──────────────────┘                      │
└──────────────────────────────────────────────────────────────────┘
```

1. **Event Block**: The details of the request execution (timestamp, path, HTTP method, response status code, outcome, latency, and agent token identity).
2. **Snapshot Block**: The state of the system at execution time (active allowlist, project configuration, secrets in scope, agent capabilities snapshot, active secret policy, and keychain connection state).
3. **Enforcement Block**: The decision path showing the results of each firewall layer checked (Capabilities check, Allowlist check, Secret policy check) and which layer triggered the first failure.
4. **Resolution Block**: The post-call handling metrics (style of injection, response scanning status, credential echo detection, redaction replacements, and SSRF validation status).

---

## Log Categories

AgentSecrets separates logs into three distinct categories to cover the entire lifecycle of configuration, security authorization, and runtime credential usage:

| Category | Storage Target | Description | How to Query |
|---|---|---|---|
| **Runtime Forensic Audit Log** | SQLite (`~/.agentsecrets/audit.db`) & Cloud Backend (Sync) | Flat indexable metadata with E2EE-linked JSON snapshots. Tracks all runtime credential usage. | `agentsecrets log`, `agentsecrets proxy logs` |
| **Workspace Policy Log** | Synchronization Server (Cloud Backend) | Audit trail of administrative settings changes (e.g., changes to domain allowlists). | `agentsecrets workspace allowlist log` |
| **Keychain Auth Security Log** | Plaintext File (`~/.local/share/keychain-auth/audit.log`) | Audit trail of secure daemon authorizations, process hash checks, and OS keychain reads. | View local audit file |
