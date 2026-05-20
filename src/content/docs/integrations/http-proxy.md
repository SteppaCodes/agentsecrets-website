# HTTP Proxy Integration

The most universal way to integrate AgentSecrets into any codebase—regardless of language or framework—is by routing your standard API calls through the AgentSecrets local proxy.

The proxy runs locally on `http://localhost:8765` and acts as a transport-layer injector.

---

## Standard Request Format

To route a request through the proxy, you modify three parts of your standard HTTP call:
:::step
1. Change the actual request URL to `http://localhost:8765/proxy`.
2. Provide the destination URL in the `X-AS-Target-URL` header.
3. Provide the key reference in an injection header (e.g., `X-AS-Inject-Bearer`).
:::

---

## Client Code Examples

### cURL

```bash
curl -X POST http://localhost:8765/proxy \
  -H "X-AS-Target-URL: https://api.stripe.com/v1/charges" \
  -H "X-AS-Inject-Bearer: STRIPE_KEY" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "amount=2000&currency=usd"
```

### Python (Requests)

```python
import requests

response = requests.post(
    "http://localhost:8765/proxy",
    headers={
        "X-AS-Target-URL": "https://api.stripe.com/v1/charges",
        "X-AS-Inject-Bearer": "STRIPE_KEY",
        "Content-Type": "application/x-www-form-urlencoded"
    },
    data={"amount": 2000, "currency": "usd"}
)
print(response.json())
```

### Node.js (Fetch)

```javascript
const response = await fetch("http://localhost:8765/proxy", {
  method: "POST",
  headers: {
    "X-AS-Target-URL": "https://api.stripe.com/v1/charges",
    "X-AS-Inject-Bearer": "STRIPE_KEY",
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: new URLSearchParams({ amount: 2000, currency: "usd" })
});
const data = await response.json();
```

### Go (net/http)

```go
package main

import (
	"net/http"
	"strings"
)

func main() {
	body := strings.NewReader("amount=2000&currency=usd")
	req, _ := http.NewRequest("POST", "http://localhost:8765/proxy", body)
	
	req.Header.Set("X-AS-Target-URL", "https://api.stripe.com/v1/charges")
	req.Header.Set("X-AS-Inject-Bearer", "STRIPE_KEY")
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	
	client := &http.Client{}
	resp, _ := client.Do(req)
	// Process response...
}
```

---

## Customizing Injection

AgentSecrets supports multiple injection methods depending on what the upstream API expects. See the [Injection Styles Reference](../proxy/injection-styles.md) for details on:
- `X-AS-Inject-Header: <HeaderName> <KeyName>` (Custom header injection)
- `X-AS-Inject-Query: <ParamName> <KeyName>` (URL query parameter injection)
- `X-AS-Inject-Basic: <Username> <PasswordKey>` (Basic authentication)
