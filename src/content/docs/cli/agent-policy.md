# Agent Policy (Capabilities) & Secret Constraints

To ensure fine-grained control and zero-trust security when deploying AI agents, AgentSecrets implements two key enforcement layers on top of your credentials: **Agent Policies (Capabilities)** and **Secret Constraints**.

---

## 🔑 Agent Policies (Capabilities)

Agent Policies allow you to bind permissions directly to an agent identity. They specify which secrets a given agent token (`agt_...`) can inject.

By default, an agent has access to all secrets within its project/workspace scope. Once you configure a policy, access is restricted to the whitelist or blacklist you define.

### Commands

#### Get Agent Policy
To inspect the policy configured for an agent:
```bash
agentsecrets agent policy get <agent-name>
```

#### Set Agent Policy
To restrict an agent to specific keys (whitelisting):
```bash
agentsecrets agent policy set <agent-name> --allow GITHUB_TOKEN,SERP_KEY
```

To block an agent from accessing specific sensitive keys (blacklisting):
```bash
agentsecrets agent policy set <agent-name> --deny STRIPE_SECRET_KEY,AWS_SECRET_ACCESS_KEY
```

> [!NOTE]
> Setting agent policies is a sensitive administrative action. The CLI will prompt you for your workspace/project password to authenticate the changes.

---

## 🔒 Secret Constraints

Secret Constraints define rules bound to **the secret key itself**, regardless of which agent is requesting it. They restrict the target domains and HTTP methods that are permitted to receive the credential.

### Structure of a Constraint

A constraint rule dictates:
1. **Target Domains**: A list of domains where the key can be sent (e.g. `api.stripe.com`). If specified, sending this key to any other domain is blocked.
2. **Method Actions**: Actions mapped to HTTP methods (`GET`, `POST`, etc.):
   - `allow`: Seamless injection.
   - `deny`: Hard block.
   - `request_permission`: Runtime developer approval required.

### Commands

#### View Secret Policy
To inspect the current policy/constraints of a secret key:
```bash
agentsecrets secrets constraints <KEY>
```

#### Set Secret Policy
To bind target constraints to a secret:
```bash
agentsecrets secrets constraints <KEY> set --domains api.stripe.com --allow GET,POST --deny DELETE --request-permission PUT
```

#### Clear Secret Policy
To remove all target constraints from a secret:
```bash
agentsecrets secrets constraints <KEY> clear
```

> [!NOTE]
> Modifying secret constraints requires password verification.

---

## 🔄 Runtime Approvals

If a secret constraint specifies `request_permission` for an HTTP method and domain, the proxy will temporarily pause the outgoing request and return a `403 Forbidden` response to the agent, specifying that developer approval is required.

To authorize the request session-wide (until the proxy is restarted), run the approval command in your developer terminal:
```bash
agentsecrets proxy approve <KEY> <METHOD> <DOMAIN>
```
Once approved, the agent can successfully re-run the request and the proxy will inject the secret.
