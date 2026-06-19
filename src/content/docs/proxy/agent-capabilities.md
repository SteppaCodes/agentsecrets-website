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

## Agent Scoping

In addition to secret whitelist/blacklist policies, agents can be restricted at a macro level to specific scopes: **Workspaces**, **Projects**, and **Environments**. This scoping is configured during agent registration or token issuance and is strictly enforced by the credential proxy.

### How Scoping Works

When registering an agent or issuing a token, you can scope it using CLI flags:

1. **Workspace Scope**: The agent is bound to the workspace active when registered. It cannot be used to resolve credentials for any other workspace.
2. **Project Scope**: By passing the `--project <name>` flag during registration, the agent's token is bound only to that specific project:
   ```bash
   agentsecrets agent register my-agent --project my-project
   ```
3. **Environment Scope**: By passing the `--env <environment>` flag during registration or token issuance, the token is bound to a specific environment (e.g., `production` or `staging`):
   ```bash
   agentsecrets agent token issue my-agent --env production
   ```

### Proxy Scope Enforcement

When the proxy validates an agent token, it fetches its scope configuration from the cache (or the backend). Before performing allowlist checks or injecting credentials, the proxy ensures that:
* The active workspace matches the agent's allowed workspace. If not, it blocks the request with `agent_workspace_mismatch`.
* The current project matches the agent's allowed project. If not, it blocks the request with `agent_project_mismatch`.
* The active environment matches the agent's allowed environment. If not, it blocks the request with `agent_environment_mismatch`.

This guarantees that an agent registered for a specific test environment cannot accidentally or maliciously resolve secrets from your production project.

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

---

## Keyring Caching & Offline Fallback

Agent tokens and their capabilities are normally validated against the cloud backend API. To prevent cloud outages from blocking local development or agent execution loops, AgentSecrets caches token specifications:

### 1. Keyring-Cached Capabilities
Whenever a token is successfully validated online:
* The proxy serializes the agent's capabilities policy and saves it securely in the local OS Keychain via `keychain-auth`.
* It stores a prefix mapping of the token to its agent registration name (`agent_token_<token>`).

### 2. Offline / Outage Fallback
If the proxy attempts to validate an agent token but the cloud API is unreachable (encountering a status code `>= 500`, TCP connection timeouts, or DNS failures):
1. The proxy switches dynamically to **Offline Fallback Mode**.
2. It queries the local OS Keychain for a mapped agent name matching the token.
3. If found, it reads the agent's cached capabilities policy from the keyring.
4. The proxy then validates and enforces the whitelist/blacklist scopes locally. If authorized, the request proceeds utilizing local keyring secrets.

This hybrid caching mechanism guarantees that your agents remain fully operational even during complete network or platform outages.
