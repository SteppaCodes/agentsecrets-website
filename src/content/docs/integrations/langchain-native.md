# LangChain Integration

AgentSecrets integrates natively with LangChain to ensure your agents can authenticate with external APIs without ever holding the plaintext credentials in their context or memory.

---

## The Zero-Knowledge Tool Pattern

When building LangChain tools (`@tool` or `BaseTool`), you traditionally inject API keys into the tool's environment or initialization parameters. With AgentSecrets, you configure the tool to route its underlying HTTP client through the local AgentSecrets proxy.

### Example: Custom LangChain Tool

:::step
1. **Store your secret**:
   ```bash
   agentsecrets secrets set STRIPE_KEY=sk_live_...
   ```
2. **Authorize the domain**:
   ```bash
   agentsecrets workspace allowlist add api.stripe.com
   ```
3. **Build the Tool**:
   Instead of using `os.environ["STRIPE_KEY"]`, configure your Python `requests` client to use the proxy injection headers:

   ```python
   import requests
   from langchain_core.tools import tool

   @tool
   def fetch_stripe_balance() -> str:
       """Fetches the current account balance from Stripe."""
       
       # The proxy runs on localhost:8765
       proxies = {
           "http": "http://localhost:8765",
           "https": "http://localhost:8765"
       }
       
       # Tell the proxy which credential to resolve
       headers = {
           "X-AS-Target-URL": "https://api.stripe.com/v1/balance",
           "X-AS-Inject-Bearer": "STRIPE_KEY"
       }
       
       # Send the request to the proxy
       response = requests.get(
           "http://localhost:8765/proxy", 
           headers=headers
       )
       
       return response.text
   ```
:::

By defining your LangChain tools this way, the agent can reason about the tool and invoke it, but the agent's memory window and process environment remain completely free of the `STRIPE_KEY`.

---

## Native LangChain Python SDK (Coming Soon)

A native Python SDK for LangChain is currently in development. It will provide a zero-knowledge HTTP client and a native `AgentSecretsTool` class that automatically handles proxy routing, certificate verification, and header injection.

Until the native SDK is released, use the HTTP proxy routing method described above.
