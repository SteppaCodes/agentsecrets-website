# Onboarding a New Developer

Onboarding a new developer to a team using traditional secrets management (like `.env` files) usually involves searching a password manager, asking teammates on Slack, or copying credentials over email. These approaches are insecure, error-prone, and slow.

With AgentSecrets, onboarding a developer takes less than a minute, provides end-to-end zero-knowledge security, and requires zero direct sharing of credential values.

---

## Step-by-step onboarding flow

The onboarding flow relies on the AgentSecrets client-side cryptosystem. When you invite a developer, their local client negotiates a key exchange with the workspace.

:::step
1. **Admin sends the invite:**
   The workspace administrator runs the invite command:
   ```bash
   agentsecrets workspace invite new-developer@acme.com
   ```
:::

:::step
2. **Developer receives the invite:**
   The developer receives an email containing a secure invite link and an invitation token.
:::

:::step
3. **Developer accepts the invite:**
   The developer runs the acceptance command in their CLI to join the workspace.
:::

---

## What the new developer runs

The developer needs to run a few simple commands to set up their machine, join the workspace, select the storage mode, and pull the latest secrets.

:::step
1. **Install the CLI:**
   ```bash
   brew install The-17/tap/agentsecrets
   ```
:::

:::step
2. **Log in or register:**
   ```bash
   agentsecrets login
   ```
:::

:::step
3. **Accept the workspace invite:**
   ```bash
   agentsecrets workspace accept --token <invite-token>
   ```
:::

:::step
4. **Initialize local workspace and select storage mode:**
   Run the initialization command. This will prompt the developer to choose their preferred storage mode:
   ```bash
   agentsecrets init
   ```
   Alternatively, they can specify the storage mode directly:
   ```bash
   # Keychain Mode (Recommended: stores secrets directly in OS Keychain)
   agentsecrets init --storage-mode 1
:::

   # Standard Mode (Writes secrets to a local .env file)
   agentsecrets init --storage-mode 2
   ```

:::step
5. **Pull the secrets:**
   ```bash
   agentsecrets secrets pull
   ```
:::

---

## No .env sharing required

Because AgentSecrets uses client-side end-to-end encryption, credential values are never shared in plaintext.

- **Direct OS Keychain integration:** In Keychain mode, pulled secrets are injected directly into the operating system's native keychain (such as macOS Keychain, Windows Credential Manager, or Linux libsecret). They are never written to disk in plaintext.
- **Zero-knowledge sync:** Secrets are encrypted on the admin's machine using the workspace key. When the new developer accepts the invite, the workspace key is encrypted with their public key. The developer's client decrypts the workspace key locally using their private key and decrypts the secrets. The AgentSecrets servers only ever store and transmit ciphertext.

---

## Verifying they are set up correctly

To ensure the new developer is ready to start coding, they should run:

```bash
agentsecrets status
```

Expected Output:
```
Logged in as:        new-developer@acme.com
Session:             Active (expires 7 hours from now)
Selected Workspace:  Acme Engineering
Environment:         development
Current Project:     payments-service
Secrets:             12 synced (0 unsynced)
```

They can now start the proxy or run their development server with environment variables injected:

```bash
# Start proxy for AI agents
agentsecrets proxy start

# Run development server with secrets injected
agentsecrets env -- npm run dev
```
