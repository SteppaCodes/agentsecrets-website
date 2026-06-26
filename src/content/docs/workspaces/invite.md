# Inviting Team Members

Collaboration in AgentSecrets relies on a zero-knowledge, end-to-end encrypted invite system. Inviting team members grants them access to a shared workspace, allowing them to pull secrets directly to their local OS keychains and run agents using the shared credentials.

---

## Sending an invite

Only administrators (`Admin`) or the workspace owner can invite new members to a shared workspace.

:::step
1. **Initiate the invite:**
   Run the `agentsecrets workspace invite` command with the collaborator's email address:
   ```bash
   agentsecrets workspace invite developer@acme.com
   ```
   To invite multiple members at once, separate their emails with spaces:
   ```bash
   agentsecrets workspace invite alice@acme.com bob@acme.com
   ```

2. **Verify pending invites:**
   To see the list of invited members and their status, view the members of the current workspace:
   ```bash
   agentsecrets workspace members
   ```
   Output:
   ```
   alice@acme.com  (member)  pending
   bob@acme.com    (admin)   pending
   ```
:::

## Accessing the Workspace

Inviting a team member adds them to the workspace immediately. Under the hood, the admin's client encrypts the workspace key using the invitee's public key and registers them with the workspace, which is why the invite is gated behind administrative privileges and password confirmation.

:::step
1. **Log in or register:**
   The invitee installs the CLI and logs in using their credentials:
   ```bash
   agentsecrets login
   ```
   The client-side end-to-end encryption engine automatically detects their workspace access, performs the secure key exchange, and decrypts their workspace key. No separate accept command is needed.

2. **Verify access and switch:**
   They can now list and switch to the new workspace:
   ```bash
   agentsecrets workspace list
   agentsecrets workspace switch "Acme Engineering"
   ```
:::

> [NOTE]
> During the acceptance process, the backend coordinates a key exchange. The workspace's shared key is encrypted with the invitee's public key. This allows the invitee to decrypt the workspace key locally without the AgentSecrets servers ever having access to the raw workspace key or secrets.

---

## Invite expiry and resending

By default, workspace invites expire after **7 days** for security. If an invite expires or needs to be revoked before acceptance, admins can manage them via the CLI.

:::step
1. **Cancel a pending invite:**
   If you need to revoke an outstanding invitation or remove access, run:
   ```bash
   agentsecrets workspace remove developer@acme.com
   ```

2. **Resend an invite:**
   To resend an expired or lost invitation, simply issue the invite command again. The system will generate a fresh invite with a new 7-day expiry:
   ```bash
   agentsecrets workspace invite developer@acme.com
   ```
:::
