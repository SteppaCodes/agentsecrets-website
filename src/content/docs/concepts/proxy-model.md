---
title: "The Proxy Model"
description: "How the Credential Proxy acts as the active credential firewall and security controller of the Zero-Knowledge architecture."
---

# The Proxy Model

The local proxy is the core of AgentSecrets. It is the central **Security Controller** and **Active Credential Firewall** of the zero-knowledge architecture. Everything else — the CLI, the SDK, the MCP server, and environment injection tools — either manages the credentials the proxy resolves or wraps proxy connections.

The proxy is not an optional utility that you "opt into"; it is the component that structurally enforces the security rules necessary to keep your zero-knowledge infrastructure secure at runtime.

---

## The Core Security Controller

Traditional secrets managers secure credentials *at rest*, but the moment a credential is retrieved for use, protection ends. The application holds the raw value in memory, exposing it to prompt injection, verbose logs, and compromised dependencies.

AgentSecrets breaks this by using the Credential Proxy as the exclusive gatekeeper:
1. **Zero-Trust Access Control**: The executing process (an AI agent, tool, or script) only holds a key name (e.g. `STRIPE_KEY`). It has no programmatic way to read the actual value.
2. **Active Interception**: Outbound requests are routed through the proxy, which decrypts values from the OS Keychain and injects them directly into headers at the transport boundary.
3. **Layered Inspections**: Before forwarding any request, the proxy checks the workspace allowlist, validates the agent's capabilities, enforces secret constraints, scans responses for credential echoes, redacts leakages, and logs metadata.

---

## Transient Proxy Architecture

To maintain the absolute integrity of these security controls, AgentSecrets enforces the proxy model for all workflows, including one-shot actions. 

Instead of writing separate, parallel logic for command line tests or MCP tools (which might bypass telemetry, redaction, or allowlists), AgentSecrets utilizes a unified **Transient Proxy** flow.

Both the CLI `call` command and the built-in MCP server's `api_call` tool call `proxy.CallViaProxy(req)`.

```
                  ┌──────────────────────┐
                  │   agentsecrets call  │
                  └──────────┬───────────┘
                             │
                             ▼
                 Does daemon PID exist &
                  is process alive?
                            / \
                           /   \
                     No   /     \   Yes
                         /       \
                        ▼         ▼
             ┌──────────────┐   ┌──────────────┐
             │ Start        │   │ Route to     │
             │ Transient    │   │ Background   │
             │ Proxy        │   │ Daemon       │
             └──────┬───────┘   └──────┬───────┘
                    │                  │
                    ├──────────────────┘
                    │
                    ▼
          Enforce All Controls:
          - Workspace Allowlist Checks
          - Agent Capabilities Policies
          - Secret Target Constraints
          - Response Redactions
          - Audit & Telemetry Metrics
                    │
                    ▼
          ┌──────────────────┐
          │ Target API Call  │
          └──────────────────┘
```

1. **Daemon Probe**: The client check if the background proxy daemon is already running (by checking `~/.agentsecrets/proxy.pid` and verifying the PID is alive).
2. **On-the-fly Server**: If the daemon is not running, the client dynamically launches a **transient proxy server** on a free random port.
3. **Unified Handling**: The request is routed to this local transient server. This ensures that the **exact same security engine** checks allowlists, verifies capabilities, redacts responses, logs audit details, and records telemetry metrics.
4. **Clean Shutdown**: Once the request completes, the transient server is shut down, and any pending logs are flushed to the cloud backend.

This transient architecture guarantees that security controls are never bypassed and telemetry is consistently gathered, even for one-off CLI calls.

---

## The Request Lifecycle Step by Step

Here is how a request flows through the proxy:

```
Agent / calling code
  │
  │  POST localhost:8765/proxy
  │  X-AS-Target-URL: https://api.stripe.com/v1/balance
  │  X-AS-Inject-Bearer: STRIPE_KEY
  │
  ▼
AgentSecrets Proxy (Daemon or Transient)
  │
  ├─ [1] Check target domain against allowlist
  │       api.stripe.com → authorized → continue
  │       (if not authorized → 403, log attempt, stop)
  │
  ├─ [2] Parse injection header
  │       X-AS-Inject-Bearer: STRIPE_KEY
  │       injection style: bearer
  │       key name: STRIPE_KEY
  │
  ├─ [3] OS keychain lookup
  │       workspace:project:environment:STRIPE_KEY
  │       → retrieve encrypted blob
  │       → decrypt in-process
  │       → value: sk_live_51H... (in proxy memory only)
  │
  ├─ [4] Construct outbound request
  │       GET https://api.stripe.com/v1/balance
  │       Authorization: Bearer sk_live_51H...
  │       (value injected directly — never returned to caller)
  │
  ├─ [5] Forward to target API
  │
  ├─ [6] Receive response
  │       Scan body for credential echo patterns
  │       If found → replace with [REDACTED_BY_AGENTSECRETS]
  │
  ├─ [7] Write audit log entry
  │       timestamp, agent identity, environment, key name,
  │       endpoint, status, duration, allowlist snapshot
  │       (no value field)
  │
  └─ [8] Return API response to caller
           {"object": "balance", "available": [...]}
           (the API response — not the credential)

Agent / calling code receives the API response
```

---

## Proxy vs Retrieval — Side by Side

| | Retrieval model | Proxy model |
|---|---|---|
| Agent holds credential value | Yes, after retrieval | Never |
| Value in calling process memory | Yes | No |
| Prompt injection can access value | Yes | No |
| Plugin/tool in same process can access | Yes | No |
| Value can appear in logs/traces | Yes | No |
| Audit log contains value | Possible | Structurally impossible |

---

## The Six Injection Styles

The proxy supports six ways to inject credentials into an outbound request, covering all common API authentication patterns:

| Style | Injects as | Use for |
|-------|-----------|---------|
| Bearer | `Authorization: Bearer <value>` | OAuth tokens, most modern APIs |
| Basic | `Authorization: Basic base64(value)` | HTTP Basic Auth |
| Custom header | `{Header-Name}: <value>` | SendGrid, Twilio, custom APIs |
| Query parameter | `?{param}=<value>` in URL | Google Maps, older REST APIs |
| JSON body | `{"path": "<value>"}` in request body | Token exchange, custom auth flows |
| Form field | `field=<value>` in form body | OAuth 2.0 form flows |

See [Auth Injection Styles](/docs/proxy/injection-styles) for full documentation and examples of each.