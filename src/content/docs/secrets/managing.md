---
title: "Managing Secrets"
description: "How to add, update, list, and delete credentials using the agentsecrets secrets CLI commands."
---

# Managing Secrets

The `agentsecrets secrets` commands allow you to store, retrieve, synchronize, and audit credentials for your active project. Every value is encrypted client-side with AES-256-GCM using your workspace key before it leaves your machine. The server only stores ciphertext it mathematically cannot decrypt.

Your agents and workflows reference key names; they never hold or see the raw values.

---

## Secret Workflow

Most workflows follow the same lifecycle:

1. You set a secret using the CLI.
2. The value is encrypted locally using AES-256-GCM.
3. The encrypted blob is synced to the cloud control plane.
4. The proxy resolves the value at runtime from your OS Keychain.
5. AI agents reference the key name, not the value.

Secrets are always scoped to:
- A specific project.
- A specific environment namespace (`development`, `staging`, `production`).
- A key name.

The same key name can exist with different values across `development`, `staging`, and `production`.

---

## Setting a Secret

Store or update one or more secrets using the `secrets set` command. Values are encrypted locally before being sent to the cloud.

### Usage

```bash
agentsecrets secrets set KEY_NAME=value
```

Set multiple secrets at once:

```bash
agentsecrets secrets set STRIPE_KEY=sk_live_... OPENAI_KEY=sk-proj-... GITHUB_TOKEN=ghp_...
```

Set the same value across all three environments simultaneously:

```bash
agentsecrets secrets set ANALYTICS_KEY=value --all-envs
```

### Production Protection (Password Verification)
Setting or updating secrets in the `production` environment, or setting them globally across all environments using `--all-envs`, requires password verification.
* **Interactive Prompt**: The CLI will securely prompt you to enter your AgentSecrets account password:
  ```
  Enter your AgentSecrets password:
  ```
  The input is hidden. If the password is correct, the change is applied; otherwise, the request is rejected immediately. This protects production environments against rogue scripts or unauthorized local modifications.

### What Happens Internally
1. The CLI retrieves your workspace encryption key from the secure OS Keychain.
2. The CLI encrypts each value locally using `AES-256-GCM` with a key derived from the workspace key.
3. The CLI sends the encrypted blob to the AgentSecrets API, and the server stores the blob.
4. The CLI saves the decrypted secret value directly into the secure OS Keychain.

### Flags
| Flag | Description |
| --- | --- |
| `--all-envs` | Set the secret in all three environments simultaneously. Requires password verification. |

---

## Listing Secrets

```bash
agentsecrets secrets list
```

Lists key names only, never values. The output shows cross-environment coverage so you can see which keys are missing in which environments without switching context:

```
Environment: development

Key              DEV  STAGING  PROD
DATABASE_URL      *      *      *
OPENAI_KEY        *      *      -
SENDGRID_KEY      *      -      -
STRIPE_KEY        *      *      *

Showing cached keys. Use --remote for latest from cloud.
```

`*` means the key is present in that environment; `-` means it is absent.

### Flags
| Flag | Description |
| --- | --- |
| `--remote` | Fetch the latest key list from the cloud instead of the local cache. |

---

## Deleting a Secret

```bash
agentsecrets secrets delete KEY_NAME
```

Deletes a secret from the active environment. The CLI removes the key from:
- The remote API database.
- Your local OS Keychain.
- Your `.env` file (if using Storage Mode 2).

When your active environment is `production`, you are prompted to confirm before the deletion proceeds.

---

## Naming Conventions

Key names must be uppercase strings with underscores as separators. This matches standard environment variable conventions.

Good names:
```
STRIPE_KEY
OPENAI_API_KEY
GITHUB_TOKEN
DATABASE_URL
```

Do not encode the environment in the key name (e.g. do not use `STRIPE_KEY_PRODUCTION`). The active environment context scopes which value is resolved.
