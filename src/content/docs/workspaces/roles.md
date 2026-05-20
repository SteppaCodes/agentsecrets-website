# Roles and Permissions

AgentSecrets enforces role-based access control (RBAC) to ensure that only authorized team members can perform administrative tasks or modify sensitive configuration settings like domain allowlists. By partitioning access into distinct roles, you can implement the principle of least privilege across your development team.

---

## Available roles

Workspaces support three primary logical roles that define a user's capabilities within the shared boundary:

- **Admin / Owner**: The highest privilege level. The workspace creator is automatically designated as the Owner. Admins have complete control over membership, role promotion/demotion, the domain allowlist, and all secret management operations.
- **Editor / Member**: The standard developer role. Editors have read and write access to the workspace secrets. They can pull secrets to their local OS keychain, push updates to the cloud, run the proxy, and deploy agents, but they cannot perform administrative tasks.
- **Viewer**: A restricted, read-only role. Viewers can pull secrets to their local OS keychain and run the proxy to execute agents, but they cannot create projects, modify secrets (`secrets set`), or push updates to the cloud.

---

## What each role can do

Each role is designed to fulfill a specific function in your development lifecycle:

| Action / Permission | Admin | Editor / Member | Viewer |
| :--- | :---: | :---: | :---: |
| **Pull Secrets (Read names/metadata)** | ✓ | ✓ | ✓ |
| **Run Proxy / Agent Tools** | ✓ | ✓ | ✓ |
| **Push Secrets (Write/Update)** | ✓ | ✓ | ✗ |
| **Create & Delete Projects** | ✓ | ✓ | ✗ |
| **Manage Domain Allowlist** | ✓ | ✗ | ✗ |
| **Invite & Remove Teammates** | ✓ | ✗ | ✗ |
| **Promote/Demote Member Roles** | ✓ | ✗ | ✗ |

---

## What each role cannot do

Understanding the constraints of each role is crucial for securing your workspace:

- **Viewers cannot modify anything**: Viewers are strictly read-only. Any attempt to run `agentsecrets secrets set` or `agentsecrets secrets push` will fail with an authorization error.
- **Editors/Members cannot change security boundaries**: Editors can work with secrets but cannot change the safety controls. They cannot add domains to the allowlist (which prevents them from authorizing malicious exfiltration endpoints), invite external users, or change other members' roles.
- **Admins cannot bypass verification**: Even Admins must confirm their identity. Actions that change security boundaries (such as adding domains to the allowlist or promoting/demoting members) require active password re-confirmation to prevent session hijacking.

---

## Promoting a member

To grant administrative privileges to an existing workspace member, use the `agentsecrets workspace promote` command.

:::step
1. **Run the promote command:**
   Execute the command with the email address of the member you want to promote:
   ```bash
   agentsecrets workspace promote developer@acme.com
   ```

2. **Verify identity:**
   The CLI will prompt you to enter your account password to confirm the promotion. This ensures that the action is performed by the authenticated administrator.
   ```
   Password: 
   ```

3. **Confirm promotion:**
   Once verified, the user will be promoted to the `Admin` role.
   ```
   ✓ Successfully promoted developer@acme.com to Admin.
   ```
:::

---

## Demoting a member

If a user no longer requires administrative privileges, you can demote them to a standard Member/Editor role using the `agentsecrets workspace demote` command.

:::step
1. **Run the demote command:**
   Execute the command with the email address of the user you want to demote:
   ```bash
   agentsecrets workspace demote developer@acme.com
   ```

2. **Confirm with password:**
   Enter your administrator password to authorize the change.
   ```
   Password: 
   ```

3. **Verify change:**
   The user's role is updated in the workspace.
   ```
   ✓ Successfully demoted developer@acme.com to Member.
   ```
:::

> [NOTE]
> The workspace Owner cannot be demoted by other Admins. Only the Owner can transfer ownership or delete the workspace.
