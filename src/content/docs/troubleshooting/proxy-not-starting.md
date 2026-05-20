---
title: Proxy Not Starting
description: Learn how to troubleshoot and resolve issues when the AgentSecrets local HTTP proxy fails to start or crashes.
---

# Troubleshooting: Proxy Not Starting

The AgentSecrets HTTP Proxy is the core engine for injecting credentials into your AI agent's outbound requests. If the proxy fails to start when running `agentsecrets proxy start`, follow this guide to resolve the issue.

## 1. Port Conflicts (Address Already in Use)

By default, the AgentSecrets proxy binds to `localhost:8765`. If another application is already using this port, the proxy will fail to start and throw an `EADDRINUSE` or `bind: address already in use` error.

**Solution:** Start the proxy on a different port using the `--port` flag:
```bash
agentsecrets proxy start --port 9000
```
*Note: If you change the port, ensure your AI agents and curl commands are updated to route traffic to `http://localhost:9000/proxy`.*

## 2. Invalid or Expired Session Token

The proxy requires a valid session to fetch the domain allowlist and background revocations. If your session is entirely expired or corrupted, the proxy cannot boot safely.

**Solution:** Re-authenticate your CLI session.
```bash
agentsecrets logout
agentsecrets login
```
After logging in, attempt to start the proxy again.

## 3. Corrupted Configuration or Keychain Access

The proxy needs access to your OS keychain (to resolve secrets) and the `~/.agentsecrets/config.json` file. On some headless Linux servers or WSL environments, OS keychain access might require unlocking or configuring dbus/secret-service.

> [WARNING]
> If you are running AgentSecrets inside a CI/CD pipeline or a headless Docker container, ensure you are using the correct environment configuration for headless keyring access.

**Solution:** Check the proxy status and local configuration integrity:
```bash
agentsecrets status
```
If the keychain is locked, follow your OS-specific instructions to unlock the default login keyring.

## 4. Checking Proxy Logs

If the proxy starts but immediately crashes, inspect the background audit logs for fatal errors:
```bash
agentsecrets proxy logs --last 10
```
Look for explicit error messages during the `BOOT` phase.

> [TIP]
> The proxy strictly binds to `127.0.0.1` (localhost) for security. It will purposefully fail to start if you attempt to bind it to `0.0.0.0` without explicit overrides, as exposing the proxy to the local network is a severe security risk.
