---
title: "Proxy Security Hardening"
description: "Understand the core architecture, security design, and hardening configuration steps for the AgentSecrets Credential Proxy."
---

# Proxy Security Hardening Guide

The AgentSecrets Credential Proxy acts as the active firewall between your autonomous agents and your sensitive credentials. This guide outlines the security model and best practices for hardening the proxy in staging and production environments.

---

## The Proxy Security Model

The proxy operates under a zero-knowledge, zero-trust framework designed to mitigate agent hijacking, prompt injection, and credential exfiltration.

```
+------------------+       X-AS-Session-Token       +--------------------+
|  Agent Runtime   |  ===========================>  |  Credential Proxy  |
+------------------+                                +--------------------+
                                                              ||
                                                 Resolves via OS Keychain
                                                              ||
                                                              \/
+------------------+       Injected Outbound        +--------------------+
|   Target API     |  <===========================  |  Upstream Gateway  |
+------------------+        (Allowlist Bound)       +--------------------+
```

---

## Core Security Controls

### 1. Pre-Shared Session Token Validation
:::step
Any process interacting with the proxy port must present a valid `X-AS-Session-Token` header.
* **Seamless CLI Handling**: The CLI automatically extracts the active session token from the secure OS Keychain and injects it for you.
* **IPC Isolation**: Unauthorized programs or sandboxed browser extensions cannot make requests through the proxy port without read access to the OS Keychain (which requires OS keychain authorization).
:::

### 2. DNS Rebinding Prevention
:::step
To block DNS Rebinding, the proxy resolves the target host's IP address and dials that specific IP directly rather than passing the hostname to the connection tunnel. This ensures that the IP cannot be switched to a loopback or private address between DNS resolution and TCP connection.
:::

### 3. Server-Side Request Forgery (SSRF) Blocking
:::step
The proxy dialer intercepts all outbound connections and blocks requests targeting:
* Private IP ranges (RFC 1918, e.g., `10.0.0.0/8`, `192.168.0.0/16`).
* Local loopback addresses (`127.0.0.1`, `::1`).
* Link-local addresses and cloud metadata endpoints (`169.254.169.254`).
:::

---

## Hardening Best Practices

Follow these configuration steps to ensure absolute isolation:

### 1. Disable Local HTTP Loopback Bypass
:::step
Ensure that `--allow-local-http` is never enabled in staging or production. By keeping this option disabled, you guarantee that agents cannot communicate with any local databases, docker daemons, or sibling processes on the host machine.
:::

### 2. Enforce the Domain Allowlist
:::step
The domain allowlist is always strictly enforced by the proxy; there is no option or bypass flag to disable it. Always specify target domains explicitly before making requests:
```bash
agentsecrets workspace allowlist add api.stripe.com api.openai.com
```
Only administrators can alter this list (requiring admin password confirmation).
:::

### 3. Rotate Session Tokens Regularly
:::step
To minimize the exposure window of any local session, rotate the proxy pre-shared key periodically:
```bash
agentsecrets proxy rotate-session
```
This updates the OS Keychain and instructs the active proxy daemon to reload the token immediately.
:::
