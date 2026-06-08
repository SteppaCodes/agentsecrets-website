---
title: "Storage Modes"
description: "How local storage modes determine where your decrypted secrets are stored, while session tokens and workspace keys are always kept secure in the OS Keychain."
---

# Storage Modes

AgentSecrets supports two local storage modes that determine where decrypted secret values are stored on your machine. You choose a mode when you initialize a project using `agentsecrets init`, which is saved in `.agentsecrets/project.json`.

---

## What Storage Modes Cover

It is important to distinguish what storage modes control:
* **Decrypted Secrets**: The storage mode *only* affects where `secrets pull` writes decrypted secret values on your machine (e.g. only in the OS Keychain vs also written to a `.env.{environment}` file).
* **System Credentials (Always Keychain-Stored)**: In v3.0.0, user authentication JWT tokens (access and refresh tokens) and decrypted workspace keys are **always** stored securely in the native OS Keychain (macOS Keychain, Windows Credential Manager, or GNOME Keyring/KWallet on Linux). Plaintext files like `token.json` and `config.json` on disk are kept stripped of any sensitive credentials, ensuring a zero-disk security baseline regardless of the chosen storage mode.

---

## Mode 1: Keychain Only (Default & Recommended)

In keychain-only mode, secrets live exclusively in your OS keychain. No `.env` files are created or read.

```bash
agentsecrets init --storage-mode 1
```

**How it works:**
- `secrets set` → writes directly to OS keychain and syncs encrypted blobs to cloud.
- `secrets push` → reads from OS keychain, encrypts, and uploads to cloud.
- `secrets pull` → downloads from cloud, decrypts, and writes to OS keychain.
- `secrets pull` also generates `.env.example` containing key names and environment annotations, never values.

**Security Benefit:**
Any process running as the same user can read a file on disk. An AI agent with filesystem access can read `.env` files. The OS keychain has a fundamentally different security boundary, and other processes cannot read keychain entries without explicit authorization. Keychain-only mode means there are no secret values on disk for an agent to find.

Use Mode 1 for any project where an AI agent has filesystem access to the project directory, for all production environments, and whenever you want the strongest possible local security boundary.

---

## Mode 2: Keychain and .env File

In Mode 2, secrets are stored in the keychain and also written to `.env.{environment}` files when you pull.

```bash
agentsecrets init --storage-mode 2
```

**How it works:**
- `secrets set` → writes directly to OS keychain and syncs encrypted blobs to cloud.
- `secrets push` → reads from `.env.{current_environment}` (falls back to `.env`), encrypts, and uploads to cloud.
- `secrets pull` → downloads from cloud, decrypts, and writes to both the OS keychain and a `.env.{environment}` file.
- The `.env.{environment}` file is a convenience output of pull; the keychain remains the local source of truth.

**Security Considerations:**
Mode 2 creates `.env.{environment}` files on disk containing plaintext values after each pull. Though Mode 2 automatically adds these files to your `.gitignore`, ensure they are never committed to your repository. Do not use Mode 2 in projects where an AI agent has filesystem access to the project directory.

---

## Mode 1 vs Mode 2 Summary

| Feature | Mode 1: Keychain Only | Mode 2: Keychain + .env |
|---|---|---|
| Decrypted secrets on disk | Never | Yes — `.env.{environment}` after pull |
| Agent filesystem access risk | None | Present |
| Framework `.env` compatibility | Requires proxy or `agentsecrets env` | Native |
| Recommended for production | Yes | With caution |
| Recommended when agent has filesystem access | Yes | No |
| `.env.example` generated | Yes (names only, no values) | Yes (names only, no values) |
| Session tokens & workspace keys on disk | Never (Keychain-stored) | Never (Keychain-stored) |