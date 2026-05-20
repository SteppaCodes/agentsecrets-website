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
   To see the list of active invites and their status, list the pending invites for the current workspace:
   ```bash
   agentsecrets workspace invites list
   ```
   Output:
   ```
   EMAIL              ROLE    STATUS   SENT AT
   alice@acme.com     viewer  pending  2026-05-20 02:00
   bob@acme.com       editor  pending  2026-05-20 02:05
   ```
:::

---

## What the invitee sees

Invited members receive an email with a secure link and instructions to accept the invite. They can accept it directly via the CLI or web console.

:::step
1. **Accept the invite via email or link:**
   The invite email contains a CLI command similar to this:
   ```bash
   agentsecrets workspace accept --token <invite-token>
   ```

2. **Initialize their local CLI:**
   If they haven't set up AgentSecrets, they should install the CLI and log in:
   ```bash
   agentsecrets login
   ```

3. **Accept the workspace invite:**
   Running the acceptance command registers their local public cryptographic key (ECDH) with the workspace:
   ```bash
   agentsecrets workspace accept --token <invite-token>
   ```

4. **Verify access:**
   They can now switch to the workspace and verify they see it in their workspace list:
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
   If you need to revoke an outstanding invitation, run:
   ```bash
   agentsecrets workspace invite revoke developer@acme.com
   ```

2. **Resend an invite:**
   To resend an expired or lost invitation, simply issue the invite command again. The system will invalidate the previous token and generate a fresh invite with a new 7-day expiry:
   ```bash
   agentsecrets workspace invite developer@acme.com
   ```
:::
