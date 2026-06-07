# Issuing Cryptographic Tokens

Issued Identity is the highest tier of agent identity in AgentSecrets. It is powered by cryptographically signed, high-entropy tokens that uniquely identify an agent instance to the Credential Proxy. 

By using cryptographic tokens, you ensure that every secret resolution is fully authenticated, audited, and individually revocable.

---

## Registering an Agent

Before you can issue tokens for a specific cryptographic agent identity, the identity must be registered in your workspace. You perform this registration using the `agent register` command.

### 1. Run the register command
:::step
Open your terminal and register a new agent identity:

```bash
agentsecrets agent register "billing-processor"
```
:::

### 2. Copy the initial token
:::step
The register command will output the newly created agent's metadata and its first cryptographic token:

```
Agent registered
  Name     billing-processor
  Scope    workspace
  Token    tVwXyZ_4kR9mNpQ9aBcDeFgHiJkLmNoPqRs

Store this token securely. It will not be shown again.
To use it: export AS_AGENT_TOKEN=tVwXyZ_4kR9mNpQ9aBcDeFgHiJkLmNoPqRs
```

The server only stores a cryptographic SHA-256 hash of this token for validation; it cannot be recovered if lost.
:::

---

## Issuing Additional Tokens

If you need to generate additional tokens for an already registered agent (for example, to deploy a second instance, separate environment containers, or perform key rotation), use the `agent token issue` command:

```bash
agentsecrets agent token issue "billing-processor"
```

This generates another active token bound to the same `billing-processor` identity profile.

### 3. Store the token securely
:::step
Save the token in your production environment variables (`AGENTSECRETS_TOKEN` or `AS_AGENT_TOKEN`) or a secure secret manager (e.g. AWS Secrets Manager or Kubernetes Secrets) to inject into your running agent container.
:::

---

## Token ID format and structure

An AgentSecrets token utilizes two components: a private **raw token** used for authentication, and a public **Token ID** used for monitoring and revocation.

### Raw Token (Secret)
The raw token is a high-entropy, 32-byte URL-safe base64 string generated using secure random bytes. It contains no prefix.

### Token ID (Public)
Every issued token is assigned a public database identifier (`Token ID`) that starts with an agent token prefix:

$$\text{agt\_} + \text{workspace\_short} + \text{\_} + \text{random\_payload}$$

* **`agt_`**: The prefix indicating this is an Agent Token ID.
* **`ws01hxyz_`**: A short identifier (first 8 characters) of the workspace ID. This allows administrators and audit trails to easily trace which workspace the token belongs to without decoding the token itself.
* **`random_payload`**: A random base62-encoded string generated for primary key uniqueness.

When the proxy receives a raw agent token:
1. **Cache Verification**: It checks its local memory cache (`TokenCache`) to see if the token has been validated recently (cache TTL defaults to 5 minutes) to avoid network overhead.
2. **Hash Match**: If not cached, the proxy sends the token to the cloud backend's verification endpoint. The backend hashes the raw token with SHA-256 and compares it against the stored `token_hash` in the database.
3. **Status Check**: It ensures the token's matching Token ID is active, not expired, and has not been revoked.

---

## Authenticating requests with the token

Once you have issued a token, you can pass it to authorize API requests. Choose the method that fits your architecture:

:::tabs
### SDK
To authenticate client calls in the Python SDK, initialize the client by passing the token to the `agent_token` parameter:

```python
from agentsecrets import AgentSecrets

# Initialize with the issued agent token
client = AgentSecrets(
    project="payments-service",
    agent_token="tVwXyZ_4kR9mNpQ9aBcDeFgHiJkLmNoPqRs"  # Pass the raw agent token
)

# Outbound requests will be cryptographically attributed to "billing-processor"
response = client.call(
    url="https://api.stripe.com/v1/balance",
    bearer="STRIPE_KEY"
)
```

### CLI
To authenticate calls via the AgentSecrets CLI, pass the token using the `--token` flag, or set the `AS_AGENT_TOKEN` environment variable in your runtime:

```bash
# Option 1: Pass the token via the flag
agentsecrets call --url https://api.stripe.com/v1/balance --bearer STRIPE_KEY --token tVwXyZ_4kR9mNpQ9aBcDeFgHiJkLmNoPqRs

# Option 2: Set the environment variable
export AS_AGENT_TOKEN=tVwXyZ_4kR9mNpQ9aBcDeFgHiJkLmNoPqRs
agentsecrets call --url https://api.stripe.com/v1/balance --bearer STRIPE_KEY
```

### HTTP
If you are calling the Credential Proxy directly over HTTP, inject the token via the `X-AS-Agent-Token` header:

```bash
curl http://localhost:8765/proxy \
  -H "X-AS-Target-URL: https://api.stripe.com/v1/balance" \
  -H "X-AS-Inject-Bearer: STRIPE_KEY" \
  -H "X-AS-Agent-Token: tVwXyZ_4kR9mNpQ9aBcDeFgHiJkLmNoPqRs"
```
:::

If the token is invalid, expired, or has been revoked, the proxy will immediately terminate the call, returning a `401 Unauthorized` status:

```json
{
  "detail": "Invalid or revoked Agent Token",
  "code": "agent_unauthorized"
}
```

This failed attempt is recorded in the audit log to alert administrators of potential unauthorized access attempts.
