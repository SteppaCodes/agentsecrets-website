---
title: "Agent Identity CLI Reference"
description: "How to register agents, issue cryptographic tokens, define access policies, and integrate identities into your agent code."
---

# Agent Identity CLI Reference

This guide provides the hands-on commands and code examples needed to implement, manage, and verify Agent Identity in your workspaces.

To understand the security threat models and conceptual foundations of agent identification, read the [Agent Identity Concept Guide](/docs/concepts/agent-identity).

---

## The Identity CLI Workflow

Governing agent access follows a simple pipeline: registering the identity, setting secret capability policies, and using the tokens to authenticate requests.

```
         1. REGISTER (Identity & Token #1)
           agentsecrets agent register
                       │
                       ▼
                ┌──────────────┐
                │ Registered   │
                │  Agent ID    │
                └──────┬───────┘
                       │
                       ▼
         2. POLICY SET (Grant Access)
           agentsecrets agent policy set
                       │
                       ▼
         3. USE TOKEN (Proxy Auth)
           Export AS_AGENT_TOKEN=<token>
                       │
                       ▼
      4. ISSUE ADDITIONAL TOKENS (Optional)
           agentsecrets agent token issue
```

### 1. Register the Agent (Creates Identity & Token #1)
:::step
Registering creates a logical identity inside your workspace and automatically issues its **first active token**.

```bash
agentsecrets agent register my-billing-agent
```

* **Options**:
  * `--project, -p <project-name>`: Scope the agent identity to a specific project. If omitted, the agent operates workspace-wide.
:::

### 2. Configure Secrets Capabilities (Set Policy)
:::step
By default, newly registered agents have zero access. You must explicitly configure their capability boundary to allow them to fetch specific credentials.

To allow access to specific secrets in a project:
```bash
agentsecrets agent policy set my-billing-agent --allow STRIPE_SECRET_KEY,PLAID_CLIENT_ID
```

To deny access to specific secrets (acting as a blacklist):
```bash
agentsecrets agent policy set my-billing-agent --deny AWS_ROOT_ACCESS_KEY
```

* **Options**:
  * `--allow <keys>`: Comma-separated list of permitted secret keys.
  * `--deny <keys>`: Comma-separated list of prohibited secret keys (takes precedence).
:::

### 3. Issue Additional Tokens (Optional)
:::step
While registration generates your first token, you can issue additional tokens for the same agent profile (e.g. for key rotation, different hosting environments like staging/production, or separate developer machines):

```bash
agentsecrets agent token issue my-billing-agent --env production
```

This generates another secure token.
* **OS Keychain Storage**: The CLI automatically stores the issued token in your local OS Keychain. 
* **Key Reference**: You can use `<AGENTNAME>_TOKEN` (e.g., `MY-BILLING-AGENT_TOKEN`) in your local developer scripts, and the proxy will resolve it directly from the keyring at runtime.
:::

### 4. List and Inspect
:::step
To view all registered agents and their scopes in the current workspace:
```bash
agentsecrets agent list
```

To view all active tokens issued for a specific agent:
```bash
agentsecrets agent token list my-billing-agent
```
:::

---

## Agent Scoping Boundaries

Agents are governed by three hierarchical security boundaries: **Workspace**, **Project**, and **Environment**.

### 1. Workspace-Level Scope
When you register an agent with `agentsecrets agent register <name>`, it is bound by default to your active workspace. Workspace-scoped agents can access any allowed credentials across all projects in that workspace.

### 2. Project-Level Scope
If an agent only performs tasks for a specific project, you should restrict its identity to that project by specifying the `--project` flag during registration:
```bash
agentsecrets agent register my-billing-agent --project "my-billing-project"
```
Once scoped to a project, the proxy will strictly block this agent if it attempts to request credentials or resolve variables bound to any other project, returning an `agent_project_mismatch` block.

### 3. Environment-Level Scope
By default, an agent's tokens can only be used in the environment they were generated for. When registering an agent or issuing a token, you can bind it to a specific environment (e.g. `development`, `staging`, or `production`):
```bash
# Scope initial token during registration
agentsecrets agent register my-billing-agent --env production

# Scope a new token for an existing agent
agentsecrets agent token issue my-billing-agent --env production
```
At runtime, the proxy matches the token's environment scope against the proxy's active running environment. If they mismatch, the proxy blocks resolution immediately with `agent_environment_mismatch`.

### 4. Visualizing Scope in the CLI
To inspect agent scopes and active attributes:
* Run `agentsecrets agent list` to see the `SCOPE` column (either `workspace` or the specific project name).
* Run `agentsecrets agent token list <agent-name>` to see active token IDs, their labels, and expiry dates.

---

## Code Integration

Configure your agent code or environment to present its identity to the credential proxy.

### Level 1: Declared Identity (Attribution only)
Self-report the agent's name. Use this during local multi-agent debugging.

#### Via HTTP Header
Add the `X-AS-Agent-ID` header to outbound requests:
```http
GET https://api.stripe.com/v1/charges
X-AS-Agent-ID: my-billing-agent
```

#### Via Python SDK
```python
from agentsecrets import client

# Declarative registration in code
response = client.get(
    "https://api.stripe.com/v1/charges",
    agent_id="my-billing-agent"
)
```

---

### Level 2: Issued Identity (Cryptographic verification)
Present the cryptographically signed token. Use this for production and sensitive staging systems.

#### Via Environment Variable (Recommended)
Set the `AS_AGENT_TOKEN` environment variable in the process space where the agent is running:
```bash
export AS_AGENT_TOKEN="agt_3f8a9..."
```
The proxy automatically detects this environment variable and uses it to authorize credential requests.

#### Via HTTP Header
Pass the token in the `X-AS-Agent-Token` header:
```http
GET https://api.stripe.com/v1/charges
X-AS-Agent-Token: agt_3f8a9...
```

#### Via Python SDK
```python
from agentsecrets import client

response = client.get(
    "https://api.stripe.com/v1/charges",
    agent_token="agt_3f8a9..."
)
```

---

## Revoking an Agent or Token

If an agent is compromised or decommissioned, you can revoke its access instantly without rotating the target credentials.

### Revoking a Single Token
To invalidate a specific token without deleting the agent identity:
```bash
agentsecrets agent token revoke agt_3f8a9...
```

### Deleting the Agent
Deleting an agent automatically invalidates all tokens associated with it and wipes its capability policy:
```bash
agentsecrets agent delete my-billing-agent
```

All future requests presenting revoked tokens will immediately fail with a `401 Unauthorized` status at the proxy boundary, and the attempt will be logged in the forensic audit trail.
