# How to Share Credentials with Your Team Securely

Sharing sensitive API keys, database URLs, and third-party credentials with your team has historically been fraught with security risks. Methods like pasting keys in Slack, sending them via email, or using a shared password manager often lead to unauthorized access, leaked credentials, or out-of-sync `.env` files.

With AgentSecrets, sharing credentials is fully encrypted, end-to-end, and instantaneous. This guide walks you through the step-by-step process of securely sharing credentials with your development team.

## The Problem with Traditional Sharing

When you share an API key over a messaging app like Slack:
- It resides in plaintext on the messaging platform's servers indefinitely.
- Anyone with access to the chat history can view it.
- If a developer leaves the team, you have no guarantee they didn't copy the key, and no way to revoke their access to the chat history easily.

## The AgentSecrets Solution

AgentSecrets uses a Zero-Knowledge architecture. When you share a secret, the cryptographic keys required to decrypt it never leave your machine or your team's machines. The AgentSecrets cloud only stores and synchronizes the encrypted ciphertext.

### Step 1: Set Your Secrets Locally

Before sharing, you first set the secrets in your local environment. AgentSecrets encrypts them using your Workspace Key before pushing them to the cloud.

```bash
# Add multiple secrets at once
agentsecrets secrets set STRIPE_SECRET_KEY=sk_test_123 DATABASE_URL=postgres://user:pass@localhost:5432/db
```

If you already have them locally and just want to upload them:
```bash
agentsecrets secrets push
```

### Step 2: Invite Team Members to the Workspace

To share these secrets, you simply invite your team members to your workspace. 

```bash
agentsecrets workspace invite alice@yourcompany.com
agentsecrets workspace invite bob@yourcompany.com
```

When you invite a user, AgentSecrets performs an Elliptic-Curve Diffie-Hellman (ECDH) key exchange. Your local CLI automatically encrypts the Workspace Key using the invited user's public key. The server orchestrates the transfer, but cannot read the Workspace Key itself.

### Step 3: Team Members Accept and Pull

Once invited, your team members simply log in to their AgentSecrets account on their machines:

```bash
# Alice logs in
agentsecrets login
```

During login, Alice's CLI automatically decrypts the Workspace Key using her private key. 

She can now navigate to the project directory and pull the latest secrets:

```bash
cd my-project
agentsecrets secrets pull
```

The secrets are securely downloaded, decrypted locally, and placed directly into her local OS Keychain or `.env` file (depending on her storage mode).

## Managing Access (Revocation)

If a team member leaves the project, you can revoke their access instantly.

```bash
agentsecrets workspace revoke alice@yourcompany.com
```

This removes their access to the workspace. While they still possess the secrets they pulled locally, they will no longer receive any updates when credentials are rotated, nor can they push changes or view audit logs.

By combining AgentSecrets with regular credential rotation (which automatically syncs to all active team members), you guarantee that former employees lose access immediately.
