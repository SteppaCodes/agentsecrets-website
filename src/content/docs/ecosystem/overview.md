# AgentSecrets Ecosystem

The AgentSecrets ecosystem comprises tools, integrations, and extensions that leverage the Zero-Knowledge credential infrastructure to build highly secure AI applications. 

## Core Philosophy

All tools built in the AgentSecrets ecosystem adhere to the **No `get()` Principle**: credentials should never be returned as plaintext to the application layer. Instead, tools communicate through the AgentSecrets proxy, which transparently injects credentials at the network layer.

## Available Projects

### [Zero-Knowledge MCP](/docs/ecosystem/zk-mcp)
A Model Context Protocol (MCP) server implementation for Claude Desktop and Cursor that completely removes environment variables and configuration secrets from the AI agent's context. 

> [NOTE]
> The ecosystem is rapidly expanding. We are currently building native integrations for LangChain, CrewAI, and other popular AI frameworks to ensure secure credential handling across all agent architectures.

## Contributing to the Ecosystem

If you are building an AI tool and want to leverage AgentSecrets for secure credential injection, you can use the [AgentSecrets Python SDK](/docs/sdk/python) or interact directly with the [AgentSecrets Proxy](/docs/proxy/overview). 

If you've built something interesting, please let us know so we can feature it here!
