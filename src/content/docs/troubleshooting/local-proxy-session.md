---
title: "Local Proxy Session Token Errors"
description: "Diagnose and resolve 401 Unauthorized errors caused by missing, invalid, or expired local pre-shared proxy session tokens in AgentSecrets."
---

# Troubleshooting Local Proxy Session Token Errors

If you receive `401 Unauthorized` responses from the local proxy engine at `http://localhost:8765/proxy` or endpoints like `/approve`, `/sync`, or `/rotate-session`, your client is failing pre-shared session token validation.

---

## Understanding Local Proxy Sessions

To prevent unauthorized scripts, browser tabs, or process-escaped programs on your host machine from accessing the local credential proxy, the AgentSecrets daemon gates access using a pre-shared session token. 
* **Lifecycle**: A new session token is generated every time the proxy daemon starts (via `agentsecrets proxy start` or transient execution).
* **Storage**: The session token is stored securely in the native OS Keychain (macOS Keychain, Windows Credential Manager, or Linux Secret Service). No plaintext token files exist on disk.
* **Auto-Injection**: The `agentsecrets` CLI client and built-in MCP server automatically retrieve this token and inject it via the `X-AS-Session-Token` HTTP header, making proxy operations completely seamless.

---

## Diagnose and Fix

If you are using third-party clients, custom libraries, or experiencing connectivity issues, follow these steps to resolve token mismatch errors:

### 1. Restart the Proxy Daemon
:::step
Restarting the daemon clears out stale processes and writes a fresh, valid session token to the secure local keychain. Run:
```bash
agentsecrets proxy stop
agentsecrets proxy start
```
:::

### 2. Verify Client-Side Injection
:::step
If you are calling the proxy from custom HTTP scripts (e.g., in Node.js or Python) rather than the CLI client, you must read the pre-shared key from the OS Keychain and set it in your headers.
* **Header Name**: `X-AS-Session-Token`
* **Command to Read**: Use the CLI to safely print the active token:
  ```bash
  agentsecrets proxy rotate-session
  ```
  *(Note: This rotates the token and returns the active string, which you can load into your custom client context.)*
:::

### 3. Check OS Keychain Availability
:::step
If the OS Keychain is locked or inaccessible (e.g. running in a headless SSH session without a configured D-Bus), the proxy cannot retrieve the session token.
* Verify your keychain status by running:
  ```bash
  agentsecrets status
  ```
* If running on headless Linux, ensure `dbus-run-session` is configured or that `keychain-auth` fallback files are writable.
:::
