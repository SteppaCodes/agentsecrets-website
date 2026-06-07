# Integrations Overview

AgentSecrets is designed to act as the universal credential infrastructure for the AI era. Because it operates at the process boundary and transport layer, it can integrate with virtually any application, framework, or AI agent without requiring you to rewrite your codebase.

---

## Supported Integration Methods

You can integrate AgentSecrets into your workflow using any of the following methods, depending on your architecture and security requirements:

### 1. HTTP Proxy (Zero-Knowledge)
:::step
The most secure method for autonomous AI agents. AgentSecrets runs a local proxy daemon on port `8765`. Your application routes standard API calls through the proxy using `X-AS-Inject-Bearer` or related headers. The proxy resolves the credential from the OS Keychain, injects it, and forwards the request.
- **Best for:** LangChain, CrewAI, AutoGen, and custom agents.
- **Security:** Complete. Credentials never touch your process memory.
- [Read the HTTP Proxy Guide](http-proxy.md)
:::

### 2. Environment Injection (Process Spawning)
:::step
The highest compatibility method. You run your normal command prefixed with `agentsecrets env --`. AgentSecrets resolves your keys from the keychain and injects them as standard environment variables directly into the child process at launch time.
- **Best for:** Legacy tools, standard web applications (Next.js, Django, Spring), CI/CD pipelines, and local test suites.
- **Security:** Moderate. Credentials never touch your disk, but they are accessible in process RAM.
- [Read the Environment Injection Guide](../env-injection/any-process.md)
:::

### 3. AI Framework Integrations (LangChain & CrewAI)
:::step
Integrate AgentSecrets with popular AI frameworks (like LangChain and CrewAI) by routing the HTTP clients inside your custom agent tools through the local proxy.
- **Best for:** Developers building agent toolkits where tools need to make authenticated API calls.
- **Security:** Complete. Credentials never touch your agent's process memory or context window.
- [Read the LangChain Guide](langchain-native.md)
- [Read the CrewAI Guide](crewai-native.md)
:::

### 4. Model Context Protocol (MCP) Servers
:::step
A zero-knowledge integration for AI desktop tools (like Cursor, Claude Desktop, and Windsurf). The AgentSecrets MCP server exposes a local API call tool to the assistant over stdio, allowing the AI to query external APIs without ever holding the API keys in its context window.
- **Best for:** AI IDEs and desktop assistants.
- **Security:** Complete.
- [Read the MCP Guide](../sdk/zero-knowledge-mcp.md)
:::
