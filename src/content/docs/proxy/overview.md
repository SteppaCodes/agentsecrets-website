# Credential Proxy Overview

The AgentSecrets Credential Proxy is a lightweight, high-performance local network gateway that acts as an **Active Credential Firewall** for your applications and AI agents. 

Instead of exposing plaintext API keys directly to untrusted AI models, application code, or third-party dependencies, your system references credentials by their logical names (e.g. `STRIPE_KEY`). The proxy intercepts outbound API calls, validates security parameters, injects the real credentials at the network boundary, and scrubs sensitive keys from the HTTP response before returning it.

---

## How it works

The local proxy intercepts outbound API requests and evaluates them through multiple security layers:

```
[ Application / AI Agent ]
       │
       │ (Requests target e.g. api.stripe.com with logical keys like STRIPE_KEY)
       ▼
┌──────────────────────────────────────────────────────────────────┐
│                      AgentSecrets Proxy                          │
│                                                                  │
│  1. Agent Capabilities Check ──► Verify token permissions        │
│  2. Workspace Allowlist Check ──► Verify domain is authorized   │
│  3. Secret Policy Check ──► Verify allowed methods & limits      │
│  4. Boundary Injection ──► Retrieve & inject decrypted keys      │
│                                                                  │
│  [ Outbound TLS Call ] ──► [ Upstream API: api.stripe.com ]     │
│                                     │ (Returns API response)     │
│                                     ▼                            │
│  5. Response Redaction Scan ──► Scrub leaked credential values  │
└──────────────────────────────────────────────────────────────────┘
       │
       │ (Returns sanitized, safe response to calling code)
       ▼
[ Application / AI Agent ]
```

---

## Core Security Features

### 1. Active Boundary Injection
:::step
Credentials are never stored in plain text on disk or in environment variables. Outbound requests are sent with placeholders or header markers (e.g. `X-AS-Inject-Bearer: STRIPE_KEY`). The proxy retrieves the ciphertext from the keyring, decrypts it on-the-fly using the hardware-backed Keychain (via `keychain-auth`), injects the plaintext credential, and forwards the request.
:::

### 2. Workspace Allowlist Enforcement
:::step
The proxy blocks any outgoing API call targeting a domain not explicitly present in the workspace allowlist (e.g. `api.stripe.com`). This prevents hijacked AI agents from exfiltrating data or credentials to malicious servers.
:::

### 3. Granular Secret Policies
:::step
You can define domain and HTTP method restrictions on a per-key basis. For example, a `STRIPE_KEY` can be restricted to only execute `GET` requests targeting `api.stripe.com`, preventing the agent from executing destructive `POST` or `DELETE` actions without administrator intervention.
:::

### 4. Automatic Response Redaction
:::step
To prevent LLM memory logs or application logs from capturing credentials echoed in API responses (a common security risk with endpoints returning configuration metadata), the proxy performs a real-time scan of incoming HTTP bodies and masks any matching credential values with `[REDACTED]`.
:::

---

## Execution Modes

The proxy can run in two modes:

* **Persistent Daemon Mode**: The proxy runs as a persistent background process using `agentsecrets proxy start`.
* **Transient Proxy Mode**: If no daemon is running, the CLI automatically launches a transient proxy instance on a free port, routes the call, enforces the security policies, logs the events, and shuts it down. This guarantees 100% policy enforcement parity even when offline or in isolated CLI operations.

---

## Next Steps

To get started with the Credential Proxy, proceed to:

* [Starting and Stopping the Proxy](start-stop.md)
* [Workspace Allowlist Configuration](domain-allowlist.md)
* [Response Redaction](response-redaction.md)
