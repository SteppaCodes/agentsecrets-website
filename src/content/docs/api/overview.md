# Backend Overview

The AgentSecrets backend is a coordination API built to manage workspaces, coordinate teams, and facilitate zero-knowledge cloud synchronization. The official implementation is located in the `secretsapi` repository and is built using Python, Django, and Django Ninja.

It serves as the cloud synchronization and orchestration layer that powers the AgentSecrets CLI and SDK.

---

## What the Backend Manages

The API acts as an orchestrator for the following resources:

* **Workspaces & Teams**: Organizes developers and servers into shared boundaries. Manages member invitations, roles, and domain allowlists.
* **Encrypted Secrets Metadata**: Stores secret entries (plaintext key names and encrypted values) but is never able to decrypt the underlying secret values.
* **Agent Identities**: Resolves cryptographic agent tokens to track which AI agent or system made a call.
* **Audit Log Sync**: Receives encrypted or redacted audit logs pushed by the local credential proxy to provide centralized visibility.
* **Telemetry**: Collects anonymous, aggregated daily usage metrics to monitor client health and stability.

---

## Zero-Knowledge Guarantee

The backend operates under strict **Zero-Knowledge** constraints.

> [IMPORTANT]
> The backend structurally cannot decrypt your secrets. Plaintext credential values never enter the cloud.

All encryption and decryption happen locally on your machine:
1. When you run `agentsecrets init` or create a workspace, a symmetric **Workspace Key** is generated locally.
2. When you invite team members, your local CLI fetches their public keys from the backend, encrypts the Workspace Key for them, and uploads the encrypted key envelope to the backend.
3. Secret values are encrypted locally using AES-256-GCM prior to being pushed to the cloud (key names remain in plaintext). The backend wraps these client-encrypted values in its own at-rest encryption layer (Fernet) but structurally cannot decrypt the underlying plaintext secrets.

---

## Relationship: CLI, SDK, and API

```
┌──────────────────────────────────────┐
│        CLI / SDK / ZK MCP            │  <- Local Machine (Performs Enc/Dec)
└──────────────────┬───────────────────┘
                   │
                   │ HTTPS JSON API
                   ▼
┌──────────────────────────────────────┐
│         Backend (secretsapi)         │  <- Cloud Orchestration (Untrusted Coordinator)
└──────────────────────────────────────┘
```

The CLI, SDK, and Zero-Knowledge MCP servers are clients of this API. When you run commands like `agentsecrets project create` or `agentsecrets secrets push`, the CLI executes corresponding HTTP requests against the backend. 

---

## When to Interact with the API Directly

For 99% of tasks, you should use the CLI or SDKs. However, direct API interaction is useful when:
* Building custom dashboards or continuous integration pipelines.
* Developing custom plugins or integrations in environments where the CLI binary cannot be installed.
* Inspecting audit logs programmatically for custom enterprise compliance tools.
