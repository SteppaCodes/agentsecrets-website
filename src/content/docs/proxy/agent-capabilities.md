# Agent Capabilities

Agent Capabilities allow you to restrict which credentials a specific agent token can access. This ensures that even if an agent's environment or token is compromised, they can only read and use the subset of secrets they actually need to perform their role.

By default, newly registered agents have no constraints (empty capabilities) and can access any secret in the workspace.

---

## Setting Policy Constraints

You configure capabilities using the `agentsecrets agent policy set` command. You can specify a whitelist of allowed keys, a blacklist of denied keys, or both.

### Whitelist Mode (Only Allow Specific Secrets)
Restrict the agent so that it can *only* use specific secrets:

```bash
agentsecrets agent policy set my-agent --allow "STRIPE_SECRET_KEY,OPENAI_API_KEY"
```

If the agent attempts to make a request that requires any secret not in this list, the proxy blocks the request.

### Blacklist Mode (Deny Specific Secrets)
Explicitly prevent the agent from accessing sensitive credentials:

```bash
agentsecrets agent policy set my-agent --deny "DB_PASSWORD,AWS_MASTER_KEY"
```

The agent will be able to access any secret *except* the ones listed.

### Priority and Rules
* **Blacklist takes priority**: If a secret key name is included in both `--allow` and `--deny` lists, it is blocked.
* **Case Insensitivity**: Key names are matched case-insensitively (e.g. `stripe_key` matches `STRIPE_KEY`).

---

## Verifying Agent Policy

To view the current capabilities and constraints configured for an agent, run:

```bash
agentsecrets agent policy get my-agent
```

This displays the lists of explicitly allowed and denied secrets for the agent.

---

## Proxy Enforcement

When an agent tool makes an outbound request through the Credential Proxy, it passes its agent token:
* Either in the `X-AS-Agent-Token` header.
* Or using the `AS_AGENT_TOKEN` environment variable.

The proxy interceptor runs the following validation:
1. It validates the agent token and retrieves its capabilities.
2. For each credential requested to be injected, it checks if it is allowed under the agent's capabilities policy.
3. If any credential injection is denied, the proxy:
   * Rejects the outbound call immediately (no request leaves your machine).
   * Returns a `403 Forbidden` response to the agent with the error code `capability_denied`.
   * Logs a `BLOCKED` entry to the local proxy audit log for monitoring and governance.
