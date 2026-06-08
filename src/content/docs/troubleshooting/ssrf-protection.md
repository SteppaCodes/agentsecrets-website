---
title: "SSRF and Loopback Block Errors"
description: "Resolve proxy block errors caused by SSRF protection, private IP blocks, or non-HTTPS target destinations in AgentSecrets."
---

# Troubleshooting SSRF and Loopback Block Errors

The AgentSecrets credential proxy enforces strict boundaries to prevent malicious LLM agents or prompt injection payloads from targeting internal infrastructure or leaking credentials. If your requests are blocked with `non_https_blocked` or `ssrf_blocked` status codes, read this guide to resolve it safely.

---

## Security Protections Enforced

By default, the credential proxy enforces two core protections:
* **HTTPS Enforcement**: All external API calls must use the secure `https` scheme. Plain HTTP is strictly blocked to prevent credential sniffing.
* **SSRF & Loopback Block**: Outbound connections targeting private IP ranges (RFC 1918) or local loopback addresses (`127.0.0.1`, `localhost`, `::1`) are blocked. This prevents an agent from calling local management panels, cloud metadata endpoints (`169.254.169.254`), or database services.

---

## Diagnose and Fix

### 1. Enable Local HTTP for Development
:::step
If you are developing or testing integration APIs locally (e.g. running a local mock API server or database on localhost), you can bypass non-HTTPS and loopback blocks specifically for **localhost/127.0.0.1 destinations only**.
* Start the proxy daemon with the local http bypass flag:
  ```bash
  agentsecrets proxy start --allow-local-http
  ```
* Alternatively, set the environment variable:
  ```bash
  export AGENTSECRETS_ALLOW_LOCAL_HTTP=true
  ```
:::

### 2. Verify DNS Resolution and Rebinding Defense
:::step
The proxy dialer resolves the target host's IP address *before* establishing a connection and dial the resolved IP directly. This prevents **DNS Rebinding** attacks where an attacker rotates a domain's DNS record mid-connection to point to an internal IP.
* If your local proxy fails with `SSRF prevention: DNS lookup failed`, verify that your host machine has active internet access and can resolve external hostnames.
* Check if a corporate DNS firewall or local VPN is interfering with standard DNS resolution.
:::

### 3. Upgrade Mock Servers to HTTPS
:::step
If you are calling third-party public sandboxes that lack HTTPS, configure them to run behind a local reverse proxy (like `ngrok` or `localtonet`) that provides a valid HTTPS endpoint. This maintains the proxy's TLS integrity baseline without weakening local enforcement.
:::
