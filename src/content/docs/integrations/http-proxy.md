# HTTP Proxy — Any Framework

## The general pattern

Content for this section is coming soon.

## LangChain

Content for this section is coming soon.

## CrewAI

Content for this section is coming soon.

## AutoGen

Content for this section is coming soon.

## Any framework that makes HTTP requests

Content for this section is coming soon.

The HTTP proxy mode works with LangChain, CrewAI, AutoGen, and any framework that makes HTTP calls.

```bash
agentsecrets proxy start
```

Route requests to `http://localhost:8765/proxy` with the target URL and injection headers:

```python
# LangChain custom tool example
import requests

def call_stripe_balance():
    response = requests.get(
        "http://localhost:8765/proxy",
        headers={
            "X-AS-Target-URL": "https://api.stripe.com/v1/balance",
            "X-AS-Inject-Bearer": "STRIPE_KEY"
        }
    )
    return response.json()
```

```python
# CrewAI tool example
from crewai_tools import tool

@tool("Get Stripe Balance")
def get_stripe_balance() -> dict:
    """Get the current Stripe account balance."""
    response = requests.get(
        "http://localhost:8765/proxy",
        headers={
            "X-AS-Target-URL": "https://api.stripe.com/v1/balance",
            "X-AS-Inject-Bearer": "STRIPE_KEY"
        }
    )
    return response.json()
```

Any HTTP client pointed at the proxy with the appropriate injection headers will work. The framework does not matter.
