# Using AgentSecrets in CI/CD (Coming Soon)

Currently, AgentSecrets is designed strictly for **local development environments**. The underlying encryption and proxy models require the native OS Keychain (macOS Keychain, Windows Credential Manager, Linux Secret Service) to ensure hardware-backed security.

Because CI/CD pipelines (like GitHub Actions, GitLab CI, or CircleCI) run in ephemeral, headless containers without persistent user keychains, **AgentSecrets cannot currently be used to inject credentials into automated pipelines.**

## The Roadmap

We are actively developing headless support. In the future, you will be able to:
1. Issue a non-interactive Service Token from the CLI.
2. Store that Service Token in your CI/CD provider's secret manager.
3. Use the `agentsecrets env` command to securely pull and inject the required environment credentials directly into your build scripts and test runners.

Until this feature is released, please continue using your CI/CD provider's built-in secret management capabilities for pipeline credentials.