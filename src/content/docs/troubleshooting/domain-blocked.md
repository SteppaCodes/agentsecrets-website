---
title: Fixing "Domain Blocked" 403 Errors
description: Troubleshooting guide for resolving AgentSecrets proxy 403 Forbidden errors caused by the Zero-Trust Domain Allowlist.
---

# Fixing "Domain Blocked" 403 Errors

If your AI agent's API request fails with a `403 Forbidden` error originating from the AgentSecrets proxy, it means the target API domain has not been authorized in your workspace's **Zero-Trust Allowlist**.

## Why does AgentSecrets block domains?

To prevent Server-Side Request Forgery (SSRF) and malicious data exfiltration, the AgentSecrets HTTP Proxy and MCP Server operate on a **deny-by-default** basis. Even if a valid credential is provided, the proxy will refuse to inject the secret or forward the request if the destination domain is not explicitly allowed.

> [IMPORTANT]
> Secrets are never accessed from the keychain if the domain is blocked. The allowlist enforcement happens *before* secret resolution.

## How to Allowlist a Domain

You can authorize domains using the AgentSecrets CLI. This action requires an admin role within your workspace.

### 1. Identify the Blocked Domain
:::step
Check your proxy audit logs to see exactly which domain was blocked:
```bash
agentsecrets proxy logs --last 5
```
Look for entries with `"action": "blocked_by_allowlist"`.
:::

### 2. Add the Domain to the Allowlist
:::step
Use the `workspace allowlist add` command to authorize the domain:
```bash
agentsecrets workspace allowlist add api.stripe.com
```
You can also add multiple domains at once:
```bash
agentsecrets workspace allowlist add api.stripe.com api.github.com
```
:::

### 3. Verify the Allowlist
:::step
To ensure the domain was successfully added and propagated:
```bash
agentsecrets workspace allowlist list
```
:::

## Common Scenarios

- **Subdomains:** The allowlist is strict. If you allowlist `stripe.com`, requests to `api.stripe.com` will still be blocked unless you explicitly allow `api.stripe.com` or use wildcard configurations (if enabled in your workspace).
- **Internal IP Addresses:** Agents cannot proxy requests to internal network endpoints (e.g., `192.168.x.x` or `10.x.x.x`) unless explicitly allowed. This is a critical protection against internal network scanning.

> [TIP]
> If you are setting up a new project, run `agentsecrets workspace allowlist log` to view recent allowlist activity and identify any unexpected blocks triggered by your agent.
