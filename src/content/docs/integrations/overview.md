# Integrations Overview

AgentSecrets is designed to be deeply integrated into the AI agent ecosystem. Because AgentSecrets intercepts credentials at the transport layer via a local proxy, it inherently supports **any HTTP client in any language**. 

However, we provide specialized documentation and native SDKs for popular AI frameworks and desktop applications to ensure a seamless developer experience.

## Supported Platforms

### IDEs and Desktop Apps
- **[Claude Desktop](/docs/integrations/claude-desktop)**: Connect tools to Claude securely.
- **[Cursor](/docs/integrations/cursor)**: Give Cursor's AI authenticated tools without exposing keys.

### Frameworks (Native Support)
- **[Zero-Knowledge MCP](/docs/ecosystem/zk-mcp)**: Build Model Context Protocol servers without credentials.
- **[CrewAI (Coming Soon)](/docs/integrations/crewai-native)**: Drop-in support for CrewAI agents.
- **[LangChain (Coming Soon)](/docs/integrations/langchain-native)**: Native `BaseTool` wrappers for LangChain.

### Universal Support
- **[Any HTTP Proxy](/docs/integrations/http-proxy)**: If your language isn't supported yet, simply configure your HTTP client (e.g., `axios`, `requests`, `curl`) to route traffic through `http://localhost:8765`.

## Why Native Integrations Matter

While the HTTP proxy works universally, native integrations (like our Python SDK or the ZK-MCP) handle the proxy routing, TLS certificate verification, and error handling automatically. They provide a frictionless developer experience where you only need to specify the `key_name`.
