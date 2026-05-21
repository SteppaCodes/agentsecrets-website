# Deploying from Dev to Production (Coming Soon)

Currently, AgentSecrets is optimized strictly for **local development environments**. The proxy daemon relies heavily on native OS Keychains (macOS Keychain, Windows Credential Manager, Linux Secret Service) to ensure zero-knowledge hardware-backed security.

Because of this architecture, moving an AgentSecrets-powered application to a headless server environment (like a cloud VM or a Kubernetes pod) is not currently supported out of the box.

## The Roadmap: The Cloud Resolver

We are actively developing the **Cloud Resolver**. Once released, it will allow headless servers to securely authenticate using Service Tokens, fetch encrypted credential payloads from the AgentSecrets backend, and resolve them directly in memory without needing an OS Keychain.

Until the Cloud Resolver is released, if you are deploying to production:
1. Continue using standard environment variables or `.env` files on your server.
2. Rely on traditional Infrastructure as Code (IaC) secret injection methods like HashiCorp Vault, AWS Secrets Manager, or Kubernetes Secrets for your production deployments.
3. Use AgentSecrets exclusively to secure your local development and testing environments.
