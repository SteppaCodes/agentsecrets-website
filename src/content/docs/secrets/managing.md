---
title: "Managing Secrets"
description: "Learn how to store, retrieve, and organize credentials in AgentSecrets using environments and projects."
---

# Managing Secrets

AgentSecrets manages your credentials using a secure hierarchy of **Workspaces**, **Projects**, and **Environments** (development, staging, production). Under the hood, secrets are stored in the local OS Keychain and synchronized to the cloud using end-to-end zero-knowledge encryption.

---

## Core Principles

1. **Zero Plaintext Disk Storage**: Secrets are never written to project files or general configuration files on disk. They live in secure system memory or the native OS Keychain.
2. **Scoping by Environment**: Every secret is scoped to a specific project and environment. This ensures your AI agent in development cannot accidentally access staging or production credentials.
3. **No Plaintext Access for Agents**: Agents run requests *through* the credential proxy and refer to keys by name. Only the human developer can read plaintext values using the CLI.

---

## Basic CLI Operations

### 1. Setting a Secret
To save a credential value to the local OS Keychain:
```bash
agentsecrets secrets set STRIPE_KEY=sk_test_51...
```
To set a secret across all environments simultaneously:
```bash
agentsecrets secrets set STRIPE_KEY=sk_test_51... --all-envs
```
*Note: Modifying secrets in the `production` environment or using `--all-envs` requires local account password verification.*

### 2. Listing Secret Keys
To view all configured secret keys in the active project and environment:
```bash
agentsecrets secrets list
```
*This command lists key names and cross-environment coverage status, but never displays secret values.*

### 3. Retrieving a Secret (Developer Only)
To view a plaintext secret value in your terminal:
```bash
agentsecrets secrets get STRIPE_KEY
```
> [!CAUTION]
> This command is intended solely for human developers. AI agents and scripts should never invoke `secrets get`.

### 4. Deleting a Secret
To delete a secret from the active environment:
```bash
agentsecrets secrets delete STRIPE_KEY
```

---

## Cloud Synchronization & Operations

Explore the guides below to manage advanced secrets workflows:
* **[Pushing to Cloud Sync](./push)**: Encrypt and back up your local credentials to the workspace cloud.
* **[Pulling from Cloud Sync](./pull)**: Download workspace credentials onto a new development machine.
* **[Diffing Secrets](./diff)**: Compare local state against the cloud or trace drift between environments.
* **[Importing from .env](./import-env)**: Seamlessly migrate traditional dotenv setups to the secure keychain.
