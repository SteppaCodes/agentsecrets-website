# Secret-Level Policies & Approvals

Secret-level policies allow you to define fine-grained constraints on *where* and *how* individual secrets can be used, independent of which agent is accessing them. 

Each secret in AgentSecrets can be configured with a policy specifying allowed domains, allowed HTTP methods, and whether certain requests require explicit manual approval.

---

## Policy Evaluation Logic

When a request is processed by the proxy, the engine evaluates the secret's policy rules:

1. **Domain Constraint**: If `domains` are specified in the secret's policy, the target domain of the outbound request *must* match one of the listed domains. Otherwise, the request is immediately denied.
2. **HTTP Method Constraint**: If `methods` are mapped to actions in the policy, the request's HTTP method is evaluated:
   * **`allow`**: The request is allowed.
   * **`deny`**: The request is blocked.
   * **`request_permission`**: The request requires interactive developer approval.

If both domains and methods are configured, both constraints must be satisfied. If a secret has no policy, it is unrestricted.

---

## Handling Approvals (`request_permission`)

If a secret policy resolves to `request_permission` for a request, the proxy:
1. Temporarily blocks the request and returns a `403 Forbidden` response to the agent.
2. Returns the error code `policy_approval_required`.
3. Displays the exact CLI command required to authorize the request in the error message.

### Granting Session Approvals
To approve the request, a developer runs the `proxy approve` command in their terminal:

```bash
agentsecrets proxy approve <SECRET_KEY> <METHOD> <DOMAIN>
```

For example:
```bash
agentsecrets proxy approve STRIPE_KEY POST api.stripe.com
```

Once run, the local proxy registers a session-based approval for that specific agent, secret, domain, and method. The agent can then retry the request, and the proxy will allow it to proceed.

---

## Cloud Synchronization & Read-Through Caching

To guarantee policy consistency across multi-developer environments and headless workers, AgentSecrets implements a synchronized hybrid policy caching pipeline:

### 1. Write-Through Sync
Whenever you run policy administrative commands:
* `agentsecrets secrets policy set`
* `agentsecrets secrets policy delete`

The CLI routes these changes directly to the cloud backend database first. Once the cloud changes are successfully processed, the CLI writes them locally to the secure OS Keychain.

### 2. Read-Through Caching
When a request passes through the Credential Proxy:
1. The proxy engine queries the local OS Keychain via `keychain-auth` for the secret's policy.
2. **Cache Hit**: If found, the policy is evaluated immediately.
3. **Cache Miss**: If no local policy is found (empty keyring), the proxy performs a read-through fallback. It queries the cloud API (`secrets/get_policy`), retrieves the latest policy structure, caches it inside the secure local OS Keychain, and applies it to the active request. Subsequent calls resolve the policy directly from the local keyring.

### 3. Clean Synchronization (`pull`)
When running `agentsecrets secrets pull`, the CLI downloads all secret metadata including active policies. If a policy has been deleted or cleared in the cloud, the pull command deletes/purges the policy cache from the local OS Keychain automatically.

---

## Audit Logs and Monitoring

Any policy block or approval event is logged to the local audit trail. You can view blocked attempts and check why a request was rejected by running:

```bash
agentsecrets log list
```
