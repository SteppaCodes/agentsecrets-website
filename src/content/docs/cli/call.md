# call

## agentsecrets call — full flag reference
```bash
agentsecrets call --url URL --bearer KEY_NAME
agentsecrets call --url URL --method POST --bearer KEY_NAME --body '{...}'
agentsecrets call --url URL --header Header-Name=KEY_NAME
agentsecrets call --url URL --query param=KEY_NAME
agentsecrets call --url URL --basic KEY_NAME
agentsecrets call --url URL --body-field path=KEY_NAME
agentsecrets call --url URL --form-field field=KEY_NAME
```
Makes a single authenticated request through the proxy. All six injection styles are supported. Multiple injection flags can be combined in one call.

---

## Authenticating the Call Command

To authenticate requests through the proxy, the `call` command needs an active Agent Token. You can provide this in three ways:

1. **Direct Token Value**: Pass the raw cryptographic token using the `--token` flag:
   ```bash
   agentsecrets call --url https://api.stripe.com/v1/balance --bearer STRIPE_KEY --token tVwXyZ_4kR9mNpQ9aBcDeFgHiJkLmNoPqRs
   ```
2. **Environment Variable**: Set the `AS_AGENT_TOKEN` environment variable in your session:
   ```bash
   export AS_AGENT_TOKEN=tVwXyZ_4kR9mNpQ9aBcDeFgHiJkLmNoPqRs
   agentsecrets call --url https://api.stripe.com/v1/balance --bearer STRIPE_KEY
   ```
3. **Keychain Token Reference (Recommended)**: Instead of exposing raw tokens in your scripts or command history, pass the agent's name with the `_TOKEN` suffix (e.g. `billing-processor_TOKEN`). AgentSecrets will intercept this reference and resolve the actual token securely from your OS Keychain:
   ```bash
   # Via flag
   agentsecrets call --url https://api.stripe.com/v1/balance --bearer STRIPE_KEY --token billing-processor_TOKEN

   # Via environment variable
   export AS_AGENT_TOKEN=billing-processor_TOKEN
   agentsecrets call --url https://api.stripe.com/v1/balance --bearer STRIPE_KEY
   ```

---

## CLI Flags

### --bearer
Injects as `Authorization: Bearer <value>`.

### --basic
Injects as `Authorization: Basic <base64(username:password)>`. Expects a secret containing `username:password`.

### --header
Injects as a custom header `Header-Name: <value>`. Must be in `Header-Name=KEY_NAME` format.

### --query
Injects as a query parameter `?param=<value>`. Must be in `param=KEY_NAME` format.

### --body-field
Injects into a JSON body field at the specified path. Must be in `json.path=KEY_NAME` format.

### --form-field
Injects into a form field. Must be in `field=KEY_NAME` format.

### --url
The target API URL (required).

### --method
The HTTP method to use (default: `GET`).

### --body
The request body to send (JSON string).

### --token
The agent token or Keychain token reference (e.g., `billing-processor_TOKEN`). If omitted, reads the `AS_AGENT_TOKEN` environment variable.

