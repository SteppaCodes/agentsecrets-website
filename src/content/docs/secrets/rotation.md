# Rotating Credentials

Secret rotation is a critical lifecycle event. Because AgentSecrets employs a zero-knowledge, local-first architecture, rotating a credential requires pushing the new encrypted value to the synchronization server so that teammates can pull it.

---

## How to Rotate a Secret

To rotate an existing secret (e.g., you rolled your Stripe API key in the Stripe Dashboard and need to update your local codebase):

1. **Overwrite the Local Value**: Use the standard `set` command. It will overwrite the existing entry in your local OS Keychain.
   ```bash
   agentsecrets secrets set STRIPE_KEY=sk_live_new12345
   ```
2. **Push the Update**: Push the newly encrypted ciphertext to the AgentSecrets synchronization server.
   ```bash
   agentsecrets secrets push
   ```
3. **Notify Teammates**: Instruct your team or CI/CD pipelines to pull the latest changes.
   ```bash
   agentsecrets secrets pull
   ```

---

## What Happens During Rotation?

When you push a rotated secret, AgentSecrets performs a cryptographic envelope replacement:
- Your local CLI encrypts the new value using your Workspace Key.
- The ciphertext blob replaces the old blob on the cloud server.
- The server records a rotation event in the audit log.
- When your teammates run `secrets pull`, their local CLI detects the changed ciphertext hash, downloads the new blob, decrypts it using their local Workspace Key, and silently overwrites the old value in their OS Keychain.

> [TIP]
> If you are rotating a key that is used across multiple environments (`development`, `staging`, `production`), you can use the `--all-envs` flag to overwrite it globally in one command before pushing.
> ```bash
> agentsecrets secrets set STRIPE_KEY=sk_live_new --all-envs
> ```
