/**
 * Canonical list of all documentation sections.
 * Shared between the docs page component and the build-time search index generator.
 */
export const DOCS_SECTIONS = [
  // Getting Started
  { id: "what-is-agentsecrets", group: "Getting Started", label: "What is AgentSecrets?" },
  { id: "zero-knowledge-difference", group: "Getting Started", label: "The Zero-Knowledge Difference" },
  { id: "how-it-works", group: "Getting Started", label: "How AgentSecrets Works" },
  { id: "installation", group: "Getting Started", label: "Installation" },
  { id: "quick-start", group: "Getting Started", label: "Quick Start" },
  { id: "migrate-from-env", group: "Getting Started", label: "Migrating from .env Files" },
  { id: "migrate-from-vault", group: "Getting Started", label: "Migrating from Vault / AWS" },
  { id: "migrate-from-dotenv-vault", group: "Getting Started", label: "Migrating from dotenv-vault" },
  { id: "production-checklist", group: "Getting Started", label: "Production Checklist" },

  // Fundamental Concepts
  { id: "concepts/credential-exposure", group: "Fundamental Concepts", label: "Credential Exposure" },
  { id: "concepts/zero-knowledge", group: "Fundamental Concepts", label: "What Zero-Knowledge Means" },
  { id: "concepts/proxy-model", group: "Fundamental Concepts", label: "The Proxy Model" },
  { id: "concepts/secrets-projects-workspaces", group: "Fundamental Concepts", label: "The Three-Layer Model" },
  { id: "concepts/environments", group: "Fundamental Concepts", label: "Environments" },
  { id: "concepts/agent-identity", group: "Fundamental Concepts", label: "Agent Identity" },
  { id: "concepts/storage-modes", group: "Fundamental Concepts", label: "Storage Modes" },
  { id: "concepts/no-get-method", group: "Fundamental Concepts", label: "The No get() Principle" },

  // Secrets
  { id: "secrets/managing", group: "Secrets", label: "Managing Secrets" },
  { id: "secrets/push", group: "Secrets", label: "Pushing to Cloud Sync" },
  { id: "secrets/pull", group: "Secrets", label: "Pulling from Cloud Sync" },
  { id: "secrets/diff", group: "Secrets", label: "Diffing Secrets" },
  { id: "secrets/import-env", group: "Secrets", label: "Importing from .env" },
  { id: "secrets/rotation", group: "Secrets", label: "Secret Rotation (Soon)" },

  // Environments
  { id: "environments/overview", group: "Environments", label: "Environments Overview" },
  { id: "environments/switch", group: "Environments", label: "Switching Environments" },
  { id: "environments/list", group: "Environments", label: "Listing & Coverage" },
  { id: "environments/copy", group: "Environments", label: "Copying an Environment" },
  { id: "environments/merge", group: "Environments", label: "Merging Environments" },
  { id: "environments/clean", group: "Environments", label: "Cleaning an Environment" },

  // The Credential Proxy
  { id: "proxy/overview", group: "The Credential Proxy", label: "Proxy Overview" },
  { id: "proxy/start-stop", group: "The Credential Proxy", label: "Starting and Stopping" },
  { id: "proxy/injection", group: "The Credential Proxy", label: "How Injection Works" },
  { id: "proxy/injection-styles", group: "The Credential Proxy", label: "Auth Injection Styles" },
  { id: "proxy/domain-allowlist", group: "The Credential Proxy", label: "Domain Allowlist" },
  { id: "proxy/response-redaction", group: "The Credential Proxy", label: "Response Body Redaction" },
  { id: "proxy/ssrf-protection", group: "The Credential Proxy", label: "SSRF Protection" },
  { id: "proxy/session-token", group: "The Credential Proxy", label: "Session Token Auth" },
  { id: "proxy/logs", group: "The Credential Proxy", label: "Proxy Logs" },
  { id: "proxy/http-clients", group: "The Credential Proxy", label: "Using with HTTP Clients" },
  { id: "proxy/performance", group: "The Credential Proxy", label: "Performance & Latency" },

  // Environment Variable Injection
  { id: "env-injection/overview", group: "Env Injection", label: "How it Works" },
  { id: "env-injection/any-process", group: "Env Injection", label: "Injecting into Any Process" },
  { id: "env-injection/proxy-vs-env", group: "Env Injection", label: "Proxy vs env Injection" },

  // Workspaces & Teams
  { id: "workspaces/overview", group: "Workspaces & Teams", label: "Workspaces Overview" },
  { id: "workspaces/create", group: "Workspaces & Teams", label: "Creating a Workspace" },
  { id: "workspaces/invite", group: "Workspaces & Teams", label: "Inviting Team Members" },
  { id: "workspaces/roles", group: "Workspaces & Teams", label: "Roles and Permissions" },
  { id: "workspaces/onboarding", group: "Workspaces & Teams", label: "Onboarding a Developer" },
  { id: "workspaces/revoke", group: "Workspaces & Teams", label: "Revoking Access" },
  { id: "workspaces/multiple", group: "Workspaces & Teams", label: "Multiple Workspaces" },

  // Projects
  { id: "projects/overview", group: "Projects", label: "Projects Overview" },
  { id: "projects/create", group: "Projects", label: "Creating a Project" },
  { id: "projects/switch", group: "Projects", label: "Switching Between Projects" },
  { id: "projects/update-delete", group: "Projects", label: "Updating and Deleting" },
  { id: "projects/invites", group: "Projects", label: "Project Invites" },
  { id: "projects/organizing", group: "Projects", label: "Organizing Projects" },

  // Agent Identity
  { id: "agent-identity/overview", group: "Agent Identity", label: "Identity Overview" },
  { id: "agent-identity/anonymous", group: "Agent Identity", label: "Anonymous Agents" },
  { id: "agent-identity/declared", group: "Agent Identity", label: "Declared Identity" },
  { id: "agent-identity/tokens-issue", group: "Agent Identity", label: "Cryptographic Tokens" },
  { id: "agent-identity/token-lifecycle", group: "Agent Identity", label: "Token Lifecycle" },
  { id: "agent-identity/multi-agent", group: "Agent Identity", label: "Multi-Agent Systems" },
  { id: "agent-identity/auditing", group: "Agent Identity", label: "Auditing by Identity" },
  { id: "agent-identity/anonymous-gaps", group: "Agent Identity", label: "Finding Coverage Gaps" },

  // Audit & Governance
  { id: "audit/overview", group: "Audit & Governance", label: "Audit Log Overview" },
  { id: "audit/reading", group: "Audit & Governance", label: "Reading and Filtering" },
  { id: "audit/summary", group: "Audit & Governance", label: "Log Summary" },
  { id: "audit/export", group: "Audit & Governance", label: "Exporting Logs (CSV)" },
  { id: "audit/detail", group: "Audit & Governance", label: "Log Detail" },
  { id: "audit/compliance", group: "Audit & Governance", label: "Using for Compliance" },

  // Integrations
  { id: "integrations/overview", group: "Integrations", label: "Integrations Overview" },
  { id: "integrations/claude-desktop", group: "Integrations", label: "Claude Desktop" },
  { id: "integrations/cursor", group: "Integrations", label: "Cursor" },
  { id: "integrations/openclaw", group: "Integrations", label: "OpenClaw" },
  { id: "integrations/http-proxy", group: "Integrations", label: "HTTP Proxy (Any)" },
  { id: "integrations/langchain-native", group: "Integrations", label: "LangChain (Soon)" },
  { id: "integrations/crewai-native", group: "Integrations", label: "CrewAI (Soon)" },
  { id: "integrations/cicd", group: "Integrations", label: "CI/CD Pipeline" },

  // SDK
  { id: "sdk/overview", group: "SDK", label: "SDK Overview" },
  { id: "sdk/python", group: "SDK", label: "Python SDK" },
  { id: "sdk/python-reference", group: "SDK", label: "Python API Reference" },
  { id: "sdk/javascript", group: "SDK", label: "JavaScript SDK (Soon)" },
  { id: "sdk/zero-knowledge-mcp", group: "SDK", label: "ZK MCP Server" },

  // API & Backend
  { id: "api/overview", group: "API & Backend", label: "Backend Overview" },
  { id: "api/architecture", group: "API & Backend", label: "API Architecture" },
  { id: "api/authentication", group: "API & Backend", label: "Authentication" },
  { id: "api/workspaces", group: "API & Backend", label: "Workspaces API" },
  { id: "api/projects", group: "API & Backend", label: "Projects API" },
  { id: "api/secrets", group: "API & Backend", label: "Secrets API" },
  { id: "api/environments", group: "API & Backend", label: "Environments API" },
  { id: "api/agent-identity", group: "API & Backend", label: "Agent Identity API" },
  { id: "api/audit", group: "API & Backend", label: "Audit Log API" },
  { id: "api/reference", group: "API & Backend", label: "API Reference (Swagger)" },

  // Guides
  { id: "guides/guide", group: "Guides", label: "Guides Overview" },
  { id: "guides/stripe", group: "Guides", label: "Stripe Integration" },
  { id: "guides/openai", group: "Guides", label: "OpenAI Integration" },
  { id: "guides/multi-agent", group: "Guides", label: "Multi-Agent Setup" },
  { id: "guides/onboarding-developer", group: "Guides", label: "Onboarding Team" },
  { id: "guides/cicd", group: "Guides", label: "CI/CD Pipeline" },
  { id: "guides/build-zk-mcp", group: "Guides", label: "Publishing ZK MCP" },
  { id: "guides/rotate-credential", group: "Guides", label: "Rotating Credentials" },
  { id: "guides/audit-team", group: "Guides", label: "Auditing Team Activity" },
  { id: "guides/dev-to-production", group: "Guides", label: "Dev to Production" },
  { id: "guides/monorepo", group: "Guides", label: "Monorepo Setup" },

  // Security
  { id: "security/overview", group: "Security", label: "Security Overview" },
  { id: "security/encryption", group: "Security", label: "Encryption Model" },
  { id: "security/cloud-sync", group: "Security", label: "Zero-Knowledge Sync" },
  { id: "security/proxy-layers", group: "Security", label: "Proxy Security Layers" },
  { id: "security/threat-model", group: "Security", label: "Threat Model" },
  { id: "security/faq", group: "Security", label: "Security FAQ" },
  { id: "security/audit-status", group: "Security", label: "Third-Party Audit" },
  { id: "security/reporting", group: "Security", label: "Reporting Vulnerabilities" },

  // Comparisons
  { id: "comparisons/vs-env-files", group: "Comparisons", label: "vs .env Files" },
  { id: "comparisons/vs-vault", group: "Comparisons", label: "vs HashiCorp Vault" },
  { id: "comparisons/vs-aws-secrets-manager", group: "Comparisons", label: "vs AWS Secrets Manager" },
  { id: "comparisons/vs-dotenv-vault", group: "Comparisons", label: "vs dotenv-vault" },
  { id: "comparisons/vs-infisical", group: "Comparisons", label: "vs Infisical" },
  { id: "comparisons/when-not-to-use", group: "Comparisons", label: "When Not to Use" },

  // Troubleshooting
  { id: "troubleshooting/proxy-not-starting", group: "Troubleshooting", label: "Proxy Not Starting" },
  { id: "troubleshooting/proxy-not-resolving", group: "Troubleshooting", label: "Proxy Not Resolving" },
  { id: "troubleshooting/domain-blocked", group: "Troubleshooting", label: "Domain Blocked" },
  { id: "troubleshooting/sync-conflicts", group: "Troubleshooting", label: "Sync Conflicts" },
  { id: "troubleshooting/mcp", group: "Troubleshooting", label: "MCP Not Connecting" },
  { id: "troubleshooting/session-token", group: "Troubleshooting", label: "Session Token Errors" },
  { id: "troubleshooting/installation", group: "Troubleshooting", label: "Installation Issues" },

  // FAQ
  { id: "faq", group: "FAQ", label: "Frequently Asked Questions" },

  // Changelog
  { id: "changelog/v1-2-0", group: "Changelog", label: "v1.2.0" },
  { id: "changelog/v1-1-x", group: "Changelog", label: "v1.1.x" },
  { id: "changelog/v1-0-x", group: "Changelog", label: "v1.0.x" },

  // CLI Reference
  { id: "cli/account", group: "CLI Reference", label: "init / login / logout" },
  { id: "cli/secrets", group: "CLI Reference", label: "secrets" },
  { id: "cli/environment", group: "CLI Reference", label: "environment" },
  { id: "cli/workspace", group: "CLI Reference", label: "workspace" },
  { id: "cli/project", group: "CLI Reference", label: "project" },
  { id: "cli/proxy", group: "CLI Reference", label: "proxy" },
  { id: "cli/call", group: "CLI Reference", label: "call" },
  { id: "cli/mcp", group: "CLI Reference", label: "mcp" },
  { id: "cli/env", group: "CLI Reference", label: "env" },
  { id: "cli/log", group: "CLI Reference", label: "log" },
  { id: "cli/agent", group: "CLI Reference", label: "agent" },
] as const;

export type DocSection = (typeof DOCS_SECTIONS)[number];
