# Frequently Asked Questions

Find answers to common questions about AgentSecrets, zero-knowledge architecture, and AI credential management.

## General

### What is AgentSecrets?
AgentSecrets is a zero-knowledge secrets manager purpose-built for the AI era. It prevents prompt injection credential theft by using a local proxy to inject API keys into network requests, ensuring that AI agents never hold the actual credential values in their context or memory.

### Is AgentSecrets open source?
The AgentSecrets CLI, local proxy, Python SDK, and Zero-Knowledge MCP templates are open source under the MIT license. The central synchronization backend is a hosted service.

## Security

### What does "Zero-Knowledge" mean here?
It means the central AgentSecrets server never sees your plaintext credentials. Your secrets are encrypted locally on your machine using AES-256-GCM. The server only stores ciphertext and cannot mathematically decrypt it. Furthermore, the AI Agent never sees the credentials either (The No `get()` Principle).

### How does the proxy intercept traffic?
The proxy runs locally on port `8765`. Your application routes HTTP requests through this proxy, passing a reference key (e.g., `Bearer STRIPE_KEY`). The proxy looks up the key in your local encrypted OS keychain, replaces it with the real value, and forwards the request. 

### Can a malicious AI agent bypass the proxy?
No. Because the AI agent never has the real credential, it *must* route traffic through the proxy to successfully authenticate with the upstream API. Furthermore, the proxy enforces a strict domain allowlist. Even if an agent tries to use the proxy to send the credential to `hacker.com`, the proxy will block the request.

## Workspaces and Teams

### How do I share secrets with my team?
Create a workspace and project using `agentsecrets project create`. Invite your team members. When you run `agentsecrets secrets push`, your encrypted local keychain is synced to the cloud. When they run `agentsecrets secrets pull`, they receive the ciphertext, which their local CLI decrypts using the shared workspace key.

### What happens if two people push at the same time?
AgentSecrets uses a Git-like collision detection system. The second person to push will receive a sync conflict error and must `pull` and merge the changes before pushing again.

## Supported Technologies

### Does this work with Node.js/TypeScript?
Yes! You can configure `axios`, `fetch`, or any HTTP client to route through the local proxy. A native Node.js SDK is currently in development to automate the proxy routing.

### Does this work with LangChain or CrewAI?
Yes. You can use our Python SDK inside custom tools for any framework. Native wrappers for LangChain and CrewAI are coming soon to make this even easier.
