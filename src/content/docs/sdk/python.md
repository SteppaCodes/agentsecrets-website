# Python SDK

The Python SDK provides a typed interface for making zero-knowledge calls from your code. It has no `get()` method — there is no way to retrieve a credential value into your calling code. The only operations available keep the value out of your process.

---

## Installation

```bash
pip install agentsecrets
```

`agentsecrets` is the Python SDK package. The CLI is `agentsecrets-cli` — a separate package. You need the CLI installed and the proxy running to use the SDK.

---

## Initializing the client

```python
from agentsecrets import AgentSecrets

# Defaults — uses active workspace, project, and environment from global config
client = AgentSecrets()

# Explicit configuration
client = AgentSecrets(
    workspace="Acme Engineering",
    project="payments-service",
)

# With declared agent identity
client = AgentSecrets(agent_id="billing-processor")

# With issued cryptographic token
client = AgentSecrets(agent_token="agt_ws01hxyz_4kR9mNpQ...")

# Custom proxy port
client = AgentSecrets(port=9000)

# Auto-start proxy if not running (default: True)
client = AgentSecrets(auto_start=True)
```

No credentials are passed into the constructor.

---

## Transparent HTTP client interception (Automatic proxy routing)

In addition to `client.call()`, the Python SDK supports automatic, zero-code interception of outgoing HTTP requests made by standard libraries like `requests` and `httpx`. This allows you to integrate AgentSecrets with third-party SDKs (such as the official `openai` or `stripe` packages) without rewriting any of their internal network calling code.

### How it works

When you initialize the client or call `agentsecrets.init()`, the SDK dynamically patches the core sending methods of `requests` and `httpx` (supporting both synchronous and asynchronous `httpx` clients).

:::step
1. **Initialize interception**
   Import `agentsecrets` and call `agentsecrets.init()` at the entry point of your application.
2. **Configure placeholders**
   Pass placeholder secret references instead of raw keys to third-party SDK constructors or environment variables. The placeholder format can be:
   - `Bearer AS_SECRET_<KEY_NAME>` (for standard authorization headers)
   - `AS_SECRET_<KEY_NAME>` (for general header values)
3. **Automatic detection**
   The patched HTTP client automatically scans all outgoing headers. If a placeholder is detected, it strips the placeholder header from the request.
4. **Proxy redirection**
   The client redirects the target URL of the request to the local AgentSecrets proxy daemon (`http://localhost:8765/proxy`) and attaches special control headers:
   - `X-AS-Target-URL`: The original API endpoint.
   - `X-AS-Method`: The original HTTP method.
   - `X-AS-Inject-Bearer`: The name of the secret key to inject as a bearer token.
   - `X-AS-Inject-Header-<name>`: The name of the secret key to inject into the specified custom header.
5. **Secure resolution**
   The local proxy resolves the actual credential from the OS Keychain, checks the domain against the workspace allowlist, verifies policies, injects the real key, executes the call, and returns the response safely.
:::

> [IMPORTANT]
> The target domain (e.g. `api.openai.com` or `api.stripe.com`) must be added to the workspace allowlist using `agentsecrets workspace allowlist add <domain>` prior to execution. If not authorized, the proxy will reject the request.

### Third-party SDK examples

#### OpenAI integration

```python
import openai
import agentsecrets

# Register HTTP client interception hooks
agentsecrets.init()

# Initialize OpenAI with a placeholder API key.
# The raw key value never enters your Python process memory or environment space.
client = openai.OpenAI(api_key="AS_SECRET_OPENAI_API_KEY")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello world!"}]
)

print(response.choices[0].message.content)
```

#### Stripe integration

```python
import stripe
import agentsecrets

# Register HTTP client interception hooks
agentsecrets.init()

# Use the placeholder for the Stripe API key
stripe.api_key = "AS_SECRET_STRIPE_SECRET_KEY"

# Requests are intercepted, routed via local proxy, and injected at the boundary
balance = stripe.Balance.retrieve()
print(balance)
```

---

## Making calls — client.call()

### Bearer token

```python
response = client.call(
    "https://api.stripe.com/v1/balance",
    bearer="STRIPE_KEY"
)
```

### POST with body

```python
response = client.call(
    "https://api.stripe.com/v1/charges",
    method="POST",
    bearer="STRIPE_KEY",
    body={"amount": 1000, "currency": "usd", "source": "tok_visa"}
)
```

### Custom header

```python
response = client.call(
    "https://api.sendgrid.com/v3/mail/send",
    method="POST",
    header={"X-Api-Key": "SENDGRID_KEY"},
    body=payload
)
```

### Query parameter

```python
response = client.call(
    "https://maps.googleapis.com/maps/api/geocode/json",
    params={"address": "Lagos, Nigeria"},
    query={"key": "GOOGLE_MAPS_KEY"}
)
```

### Basic auth

```python
response = client.call(
    "https://jira.example.com/rest/api/2/issue/PROJ-1",
    basic="JIRA_CREDS"
)
```

### Multiple credentials in one call

```python
response = client.call(
    "https://api.example.com/data",
    bearer="AUTH_TOKEN",
    header={"X-Org-ID": "ORG_SECRET"}
)
```

### Async

```python
response = await client.async_call(
    "https://api.openai.com/v1/models",
    bearer="OPENAI_KEY"
)
```

---

## call() full signature

```python
response = client.call(
    url,               # str — required, must be HTTPS
    method="GET",      # str — HTTP method
    bearer=None,       # str — key name to inject as bearer token
    basic=None,        # str — key name to inject as basic auth
    header=None,       # dict — {header-name: key-name} for custom headers
    query=None,        # dict — {param-name: key-name} for query params
    body_field=None,   # dict — {json-path: key-name} for JSON body injection
    form_field=None,   # dict — {field-name: key-name} for form body injection
    body=None,         # dict or str — request body (not a credential)
    params=None,       # dict — non-credential query parameters
    headers=None,      # dict — non-credential request headers
    timeout=30,        # int — request timeout in seconds
)
```

All key name parameters (`bearer`, `basic`, `header`, `query`, `body_field`, `form_field`) accept the key name as a string — not the value. The proxy resolves the value.

---

## Response object

```python
response.status_code   # int — HTTP status code
response.body          # str — raw response body
response.json()        # dict — parsed JSON response
response.headers       # dict — response headers
response.redacted      # bool — True if proxy scrubbed a credential echo
response.duration_ms   # int — request duration in milliseconds
```

There is no field containing the credential value. The response object has no mechanism to carry it.

---

## Spawning processes — client.spawn()

Inject secrets as environment variables into a child process. The calling code never sees the values.

```python
result = client.spawn("stripe", ["mcp"])
result = client.spawn("python", ["manage.py", "runserver"])

# With additional non-credential environment variables
result = client.spawn("node", ["server.js"], env={"PORT": "3000"})

# Async
proc = await client.spawn_async("stripe", ["mcp"])
```

---

## Management surface

The SDK exposes the full management surface for automation and programmatic workflows:

```python
# Secrets — names only, never values
client.secrets.list()
client.secrets.check(["STRIPE_KEY", "OPENAI_KEY"])  # returns {key_name: bool}
client.secrets.pull()
client.secrets.push()
client.secrets.diff()

# Environments
client.environments.switch("production")
client.environments.list()

# Status
status = client.status()
# status.workspace     str
# status.project       str
# status.environment   str
# status.proxy_running bool
# status.proxy_port    int
# status.last_sync     datetime
```

---

## MockAgentSecrets for testing

Test your agent code without a running proxy or real credentials:

```python
from agentsecrets import MockAgentSecrets

mock = MockAgentSecrets(
    responses={
        "https://api.stripe.com/v1/balance": {
            "object": "balance",
            "available": [{"amount": 420000, "currency": "usd"}]
        }
    },
    status_code=200,
    environment="development"
)

# Use exactly like the real client
response = mock.call(
    "https://api.stripe.com/v1/balance",
    bearer="STRIPE_KEY"
)

assert response.json()["available"][0]["amount"] == 420000

# Assert calls were made correctly
assert len(mock.calls) == 1
assert mock.calls[0].key_name == "STRIPE_KEY"
assert mock.calls[0].url == "https://api.stripe.com/v1/balance"
assert mock.calls[0].method == "GET"
assert mock.calls[0].environment == "development"

# mock.calls[0] has no value field — it does not exist
```

`MockAgentSecrets` is a drop-in replacement for `AgentSecrets` in tests. It does not require a running proxy, does not make real HTTP calls, and records no credential values on mock call objects.

---

## Error handling

```python
from agentsecrets import AgentSecrets, AgentSecretsError, ProxyNotRunningError, KeyNotFoundError

client = AgentSecrets()

try:
    response = client.call(
        "https://api.stripe.com/v1/balance",
        bearer="STRIPE_KEY"
    )
except ProxyNotRunningError:
    # Proxy is not running — start it with agentsecrets proxy start
    pass
except KeyNotFoundError:
    # STRIPE_KEY does not exist in the current project/environment
    pass
except AgentSecretsError as e:
    print(e)
```