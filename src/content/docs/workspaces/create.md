# Creating a Workspace

Shared workspaces are the primary unit of collaboration in AgentSecrets. They allow you to group projects, configure access controls, share encrypted credentials securely, and audit agent activity across a team.

---

## The create command

To create a new shared workspace, use the `agentsecrets workspace create` command. The user who runs this command is automatically assigned the **Owner** and **Admin** roles.

```bash
agentsecrets workspace create "Acme Engineering"
```

Under the hood, creating a workspace performs the following actions:
- Generates a local cryptographic workspace keypair (ECDH) that will be used to encrypt and decrypt workspace secrets.
- Registers the workspace metadata on the AgentSecrets backend.
- Sets up the root administrator permissions for the creator.

---

## Naming and setup

Workspace names must be alphanumeric and can contain spaces, dashes, or underscores. They should clearly represent your team or organization context.

:::step
1. **Choose a unique name:**
   Choose a descriptive name for the workspace, such as `"Acme Engineering"` or `"Billing Team"`.
   ```bash
   agentsecrets workspace create "Billing Team"
   ```
:::

:::step
2. **Verify workspace creation:**
   Listing your workspaces will show both your default personal workspace and the newly created shared workspace.
   ```bash
   agentsecrets workspace list
   ```
   Output:
   ```
   * personal      (your-username)   ← active
     Billing Team  (shared)          1 member
   ```
:::

:::step
3. **Switch to the new workspace:**
   Switch to the new workspace to begin creating projects and configuring allowlists.
   ```bash
   agentsecrets workspace switch "Billing Team"
   ```
:::

:::step
4. **Verify the active context:**
   Check the active workspace and environment:
   ```bash
   agentsecrets status
   ```
:::

> [NOTE]
> All subsequent CLI commands (such as `project create`, `secrets set`, and `workspace allowlist`) run in the context of the active workspace. Always verify your active workspace with `agentsecrets status` before making changes.

---

## Inviting your first members

Once a shared workspace is created, you can invite team members immediately. Inviting a developer initiates a secure, end-to-end encrypted key exchange.

:::step
1. **Invite members via CLI:**
   Provide the email addresses of the developers you wish to invite:
   ```bash
   agentsecrets workspace invite dev1@example.com dev2@example.com
   ```
:::

:::step
2. **Wait for acceptance:**
   Invited members will receive an email containing a secure link. They can accept it via the CLI or web dashboard. Once accepted, their local CLI generates its own keypair and exchanges public keys with your workspace.
:::

> [IMPORTANT]
> You can only invite collaborators to a **Shared Workspace**. Personal workspaces are restricted to solo use. If you need to share a project from a personal workspace, use `agentsecrets project invite`, which automatically handles the migration of that project to a new shared workspace.
