# Stripe Integration

Integrating Stripe into your agentic workflow using AgentSecrets is straight-forward and ensures your PCI-relevant API keys never leak into the LLM context.

## 1. Store your Stripe Key
:::step

```bash
agentsecrets secrets set STRIPE_KEY=sk_test_...
```
:::

## 2. Allowlist the Domain
:::step

```bash
agentsecrets workspace allowlist add api.stripe.com
```
:::

## 3. Make Requests via Proxy
:::step

You can use the AgentSecrets Python SDK directly:

```python
from agentsecrets import AgentSecrets
client = AgentSecrets()

response = client.call(
    "https://api.stripe.com/v1/customers",
    bearer="STRIPE_KEY"
)
```
:::

### Using the Official Stripe SDK

If you prefer using the official `stripe-python` library, you can configure it to route traffic through the proxy and pass the reference key instead of the actual key:

```python
import stripe
import os

# Set the key to the reference name
stripe.api_key = "STRIPE_KEY"

# Route traffic through the local proxy
stripe.proxy = "http://localhost:8765"
# Or disable SSL verification if your proxy uses a self-signed cert
# stripe.verify_ssl_certs = False

# Make a request!
customers = stripe.Customer.list()
```

> [NOTE]
> The Stripe SDK automatically sends the `Authorization: Bearer <api_key>` header. Because you set the `api_key` to `"STRIPE_KEY"`, the proxy intercepts this header, replaces the string `"STRIPE_KEY"` with the actual key from your keychain, and sends it to Stripe.
