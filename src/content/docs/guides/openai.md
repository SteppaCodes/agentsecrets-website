# OpenAI Integration

When building AI Agents, you are almost always calling an LLM provider like OpenAI. It is critical to secure the OpenAI API key, just like any other tool credential.

## 1. Store your OpenAI Key
:::step

```bash
agentsecrets secrets set OPENAI_API_KEY=sk-proj-...
```
:::

## 2. Allowlist the Domain
:::step

```bash
agentsecrets workspace allowlist add api.openai.com
```
:::

## 3. Using the Official OpenAI SDK
:::step

You can easily configure the official OpenAI Python SDK to use the AgentSecrets proxy. 

```python
from openai import OpenAI
import httpx

# Route HTTP traffic through the local proxy
proxy_client = httpx.Client(proxy="http://localhost:8765")

# Initialize the client using the KEY NAME, not the value
client = OpenAI(
    api_key="OPENAI_API_KEY",
    http_client=proxy_client
)

# The SDK uses the key name. The proxy swaps it out!
chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Say this is a test",
        }
    ],
    model="gpt-4o",
)
```

By doing this, even if a user maliciously tricks the agent into dumping its initialized variables, the `client.api_key` only holds the string `"OPENAI_API_KEY"`. The real key is completely safe from prompt injection.
:::
