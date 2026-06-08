# Forensic Log Detail Schema

The AgentSecrets audit log is structured to provide full transparency into every proxy decision while enforcing zero-knowledge safety. There are no plaintext secret values logged anywhere in the schema.

---

## The JSON Schema

When you export forensic logs or query the SQLite database, the audit records match this JSON structure:

```json
{
  "id": "log_a1b2c3d4",
  "version": "2",
  "created_at": "2026-06-07T12:00:00.000Z",
  "workspace_id": "ws_test_workspace",
  "project_id": "proj_test_project",
  "chain_hash": "a4f7831...",
  
  "event": {
    "type": "proxy_call",
    "key_name": "STRIPE_KEY",
    "domain": "api.stripe.com",
    "path": "/v1/charges",
    "method": "POST",
    "status_code": 200,
    "outcome": "success",
    "latency_ms": 143,
    "environment": "production",
    "agent_identity": {
      "token_name": "billing-agent",
      "token_id": "tok_billing_1234",
      "identity_level": "issued",
      "process_verified": true
    }
  },
  
  "snapshot": {
    "captured_at": "2026-06-07T12:00:00.000Z",
    "workspace": {
      "id": "ws_test_workspace",
      "name": "Test Workspace",
      "allowlist": ["api.stripe.com", "api.openai.com"],
      "allowlist_count": 2
    },
    "project": {
      "id": "proj_test_project",
      "name": "Billing Services",
      "environment": "production"
    },
    "secrets_in_scope": ["STRIPE_KEY", "OPENAI_KEY"],
    "secrets_count": 2,
    "agent_capabilities": {
      "token_name": "billing-agent",
      "allowed_projects": ["proj_test_project"],
      "allowed_secrets": ["STRIPE_KEY"],
      "scopes": ["proxy_call"]
    },
    "secrets_policy": {
      "key_name": "STRIPE_KEY",
      "allowed_domains": ["api.stripe.com"],
      "allowed_methods": ["POST", "GET"],
      "violation_action": "deny",
      "policy_version": "v3"
    },
    "keychain_auth": {
      "authenticated": true,
      "process_hash_verified": true,
      "session_bound": true
    },
    "proxy": {
      "version": "3.0.0",
      "port": 8765,
      "transient": false
    }
  },
  
  "enforcement": {
    "decision": "permitted",
    "decided_by": "secrets_policy",
    "layers_evaluated": [
      {
        "layer": "agent_capabilities",
        "result": "pass",
        "reason": "agent capabilities check passed"
      },
      {
        "layer": "workspace_allowlist",
        "result": "pass",
        "reason": "api.stripe.com is on the allowlist"
      },
      {
        "layer": "secrets_policy",
        "result": "pass",
        "reason": "request matches active secret policies"
      }
    ],
    "first_failure_layer": ""
  },
  
  "resolution": {
    "credential_injected": true,
    "injection_style": "bearer",
    "response_scanned": true,
    "redaction_triggered": false,
    "redaction_pattern": "",
    "redacted_field": "",
    "replacement": "",
    "ssrf_check_passed": true,
    "response_status": 200
  }
}
```

---

## Schema Component Breakdown

### 1. Flat Root Fields
- `id`: The unique record identifier (e.g., `log_a1b2c3d4`).
- `version`: Schema spec version (currently `"2"`).
- `created_at`: The exact UTC timestamp when the record was written.
- `chain_hash`: Cryptographic SHA-256 hash linking this entry to the previous record.

### 2. Event Block
- `key_name`: The key name of the secret requested by the agent (e.g. `STRIPE_KEY`).
- `domain` & `path`: Upstream API coordinates requested by the agent.
- `outcome`: Proxy resolution status (`success`, `redacted`, or `blocked`).
- `agent_identity`: Details showing the agent's verified token and identity level (`anonymous`, `declared`, or `issued`).
- `process_verified`: Indicates if the running process matches authorized code hashes.

### 3. Snapshot Block
- `workspace` & `project`: The active team environment state when the call was run.
- `secrets_in_scope`: All secrets active in the environment at execution time.
- `agent_capabilities`: The bound capabilities limiting secret access for this agent.
- `secrets_policy`: The active target domain and method rules bound to this specific secret key.
- `keychain_auth`: Connection and integrity status of the local `keychain-auth` secure daemon.

### 4. Enforcement Block
- `decision`: Final proxy firewall action (`permitted`, `blocked`, `policy_denied`, or `policy_escalated`).
- `decided_by`: The exact security layer that made the final decision.
- `layers_evaluated`: A chronological list of firewall checks performed, including individual `pass`/`fail` results, reasons, and remediation commands.

### 5. Resolution Block
- `credential_injected`: True if the proxy successfully inserted the credential value.
- `injection_style`: The method of injection (`bearer`, `header`, `query`, etc.).
- `response_scanned`: True if response scrubbing was executed.
- `redaction_triggered`: True if the upstream server echoed the credential value in the response body, forcing the proxy to mask it with `[REDACTED_BY_AGENTSECRETS]`.
- `ssrf_check_passed`: Confirms the target resolved to a public IP, preventing SSRF attacks on local resources.
