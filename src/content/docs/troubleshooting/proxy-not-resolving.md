---
title: Proxy Not Resolving Secrets
description: Troubleshoot issues where the AgentSecrets proxy fails to inject authentication headers into your AI agent's API requests.
---

# Proxy Not Resolving Secrets

If your AI agent's outbound requests are failing due to missing or invalid authentication, it means the AgentSecrets proxy is successfully receiving the request but failing to resolve and inject the secret.

## 1. Missing or Incorrect Injection Headers

The HTTP Proxy relies on `X-AS-Inject-*` headers to know *which* secret to resolve from the keychain and *where* to inject it in the destination request.

If you pass the wrong secret name, the proxy will not resolve it. Ensure your request includes the correct header formatting:
```bash
# Example: Injecting the secret named "STRIPE_KEY" as a Bearer token
curl -s http://localhost:8765/proxy \
  -H "X-AS-Inject-Bearer: STRIPE_KEY" \
  -H "X-Target-Url: https://api.stripe.com/v1/charges"
```

> [TIP]
> The secret name must exactly match the name in your active environment. Run `agentsecrets secrets list` to verify the exact key names available in your local keychain.

## 2. Secret Not Present in Active Environment

AgentSecrets partitions secrets by environment (`development`, `staging`, `production`). If your proxy is running in the `development` environment, but the secret was only added to `production`, the proxy will not find it.

Check your current environment and available keys:
```bash
agentsecrets project info
agentsecrets secrets list
```

## 3. Cryptographic Revocation

If a key was recently revoked by a team member, the proxy's **10-second background sync cycle** will pull down the revocation. The proxy will then intentionally blackhole any request attempting to use that key.

To verify if a key was revoked:
```bash
agentsecrets proxy logs --secret STRIPE_KEY
```
Look for `action: revoked_key_blocked` in the logs.

## 4. MCP Tool Configuration

If you are using the Model Context Protocol (MCP) server instead of the raw HTTP proxy, ensure the AI agent is calling the `api_call` tool with the correct payload structure. The `injections` map must reference valid local keys:
```json
{
  "url": "https://api.github.com/user",
  "method": "GET",
  "injections": {
    "bearer": "GITHUB_PAT"
  }
}
```

## 5. Domain Allowlist Interference

If the target domain is not allowlisted, the proxy halts execution *before* attempting to resolve the secret. This will result in a `403 Forbidden` rather than a missing injection. See [Fixing Domain Blocked Errors](/docs/troubleshooting/domain-blocked) for more details.
