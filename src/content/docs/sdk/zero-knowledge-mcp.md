# Building a Zero-Knowledge MCP Server

## What zero-knowledge MCP means

Content for this section is coming soon.

## Using the ZK MCP Template

Content for this section is coming soon.

## Scaffold walkthrough

Content for this section is coming soon.

## Wiring AgentSecrets into your MCP server

Content for this section is coming soon.

## Ensuring no credential values enter any config file

Content for this section is coming soon.

## Publishing your MCP server

Content for this section is coming soon.

# Building a zero-knowledge MCP server

The Python SDK is the foundation for MCP servers that never store or handle credential values. See [Building a Zero-Knowledge MCP Server](/docs/sdk/zero-knowledge-mcp) for a full walkthrough using the ZK MCP Template.

The pattern: your MCP server accepts a key name as a parameter, passes it to `client.call()`, and returns the API result. The credential value never enters your server's code.

```python
from agentsecrets import AgentSecrets
from mcp.server import Server

app = Server("my-stripe-mcp")
client = AgentSecrets()

@app.tool()
async def get_stripe_balance(key_name: str = "STRIPE_KEY") -> dict:
    """Get the current Stripe balance."""
    response = client.call(
        "https://api.stripe.com/v1/balance",
        bearer=key_name
    )
    return response.json()
```

Anyone using this MCP server cannot extract the credential value from it. There is no value in the server's scope to extract.

