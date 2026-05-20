# AgentSecrets vs HashiCorp Vault

HashiCorp Vault is the industry standard for enterprise secrets management. It is incredibly powerful, highly configurable, and provides complex features like dynamic secrets and identity-based access.

However, Vault was built for **trusted applications**, not autonomous AI agents.

## The Core Difference: Who holds the credential?

### The Vault Model

When an application uses Vault, it authenticates to Vault, requests a secret (via `get()`), and Vault returns the plaintext secret to the application over TLS. The application then holds that secret in memory and uses it to make authenticated calls.

If you connect an AI agent to Vault, the agent pulls the secret into its environment context. If the agent is compromised by a prompt injection attack, the secret can be logged or exfiltrated. 

### The AgentSecrets Model (The No get() Principle)

AgentSecrets does not have a `get()` method. 

Instead of returning a secret to the application, AgentSecrets requires the application to make its API requests *through* the AgentSecrets local proxy, passing only a **reference key name** (e.g., `STRIPE_KEY`).

The proxy intercepts the request, looks up the actual credential value in the local OS Keychain, injects it into the `Authorization` header, and forwards the request to the destination. 

**The AI agent never receives, holds, or processes the plaintext credential.**

## When to use which?

### Use HashiCorp Vault when:
- You are building traditional web applications or microservices.
- You need dynamic, time-bound secrets (e.g., generating short-lived AWS IAM roles).
- You are managing infrastructure certificates and PKI.

### Use AgentSecrets when:
- You are building AI agents (LangChain, CrewAI, AutoGen).
- You are using LLM-assisted development tools (Cursor, Claude Desktop MCPs) and do not want to paste API keys into your IDE settings.
- You need to guarantee that prompt injections cannot leak credentials.
