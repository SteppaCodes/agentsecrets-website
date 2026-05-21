# Workspaces

A workspace is the top-level container in AgentSecrets. It holds your projects, manages team membership, defines the domain allowlist, and is the unit of zero-knowledge cloud sync. Understanding workspace types and how they behave is important before inviting collaborators.

---

## Personal workspaces

Every account has a personal workspace created automatically at signup. It is tied to your account and intended for solo work. You cannot invite other users to a personal workspace — it exists for solo projects, personal agents, and experimentation that does not need to be shared.

When a project needs to be shared, create a shared workspace or use `agentsecrets project invite`, which handles the transition automatically.

---

## Shared workspaces

Shared workspaces are created explicitly for team collaboration. The creator is automatically assigned `owner` and `admin` roles.

```bash
agentsecrets workspace create "Acme Engineering"
```

All projects, secrets, and the domain allowlist in a shared workspace are accessible to all members with appropriate roles.

---

## Creating a workspace

```bash
agentsecrets workspace create "Workspace Name"
```

After creation, switch to the new workspace and create your first project:

```bash
agentsecrets workspace switch "Workspace Name"
agentsecrets project create my-service
```

---

## Listing and switching workspaces

```bash
# List all workspaces you belong to
agentsecrets workspace list

# Switch active workspace
agentsecrets workspace switch "Acme Engineering"

# To switch to your personal workspace
agentsecrets workspace switch personal
```

All subsequent commands operate in the active workspace.

---

## Inviting team members

```bash
agentsecrets workspace invite alice@example.com
agentsecrets workspace invite bob@example.com carol@example.com
```

The invited developer is added to the workspace. When they run `agentsecrets login` on their machine, they can switch to the workspace and pull secrets directly to their OS keychain — no credential values shared over Slack or email.

Workspace invites only work on shared workspaces. You cannot invite someone to a personal workspace. Use `agentsecrets project invite` instead, which creates a shared workspace automatically if the project is in a personal one.

---

## Onboarding a new developer

The invited developer runs this on their machine:

```bash
agentsecrets login
agentsecrets workspace switch "Acme Engineering"
agentsecrets project use payments-service
agentsecrets secrets pull
```

Their OS keychain now has all the secrets for that project and environment. Nothing was shared over any channel. The secrets went directly from the encrypted cloud sync to their keychain.

---

## Roles and permissions

Workspaces have two roles: member and admin.

| Permission | Member | Admin |
|---|---|---|
| Read secrets (key names) | ✓ | ✓ |
| Pull secrets to local keychain | ✓ | ✓ |
| Push secrets to cloud | ✓ | ✓ |
| Run the proxy | ✓ | ✓ |
| Use all agent-facing features | ✓ | ✓ |
| Modify the domain allowlist | ✗ | ✓ |
| Invite and remove teammates | ✗ | ✓ |
| Change member roles | ✗ | ✓ |

```bash
# Grant admin role (requires admin + password confirmation)
agentsecrets workspace promote alice@example.com

# Revoke admin role (requires admin + password confirmation)
agentsecrets workspace demote bob@example.com
```

Allowlist modifications require admin role and password confirmation at the time of the change. Even an admin cannot accidentally change the allowlist without an explicit authenticated action.

---

## Revoking access

```bash
agentsecrets workspace demote user@example.com
```

When a developer leaves the team, remove them from the workspace. Their local keychain still holds the secrets they pulled — rotate any sensitive credentials after offboarding. See [Rotating a Compromised Credential](/docs/guides/rotate-credential) for the rotation workflow.

---

## Project invites and the personal workspace transition

`agentsecrets project invite` adds a collaborator to a specific project. Its behavior depends on the workspace the project lives in.

If the project is in a shared workspace, the invite works as expected — the person is added to the workspace and gains access to the project.

If the project is in a personal workspace, inviting someone would expose all of your personal projects and secrets. Instead, AgentSecrets automatically creates a new shared workspace with the same name as the project, moves the project into it, adds you as owner and admin, and adds the invitee.

Your personal workspace is unchanged. The project now lives in an isolated shared workspace accessible only to you and the people you invited.

```bash
# You are in your personal workspace
agentsecrets status
# Workspace:  personal (your-username)
# Project:    payments-service

agentsecrets project invite alice@example.com
# → Personal workspace detected
# → Created shared workspace: "payments-service"
# → Moved project to shared workspace
# → Added you as owner and admin
# → Invited alice@example.com

agentsecrets status
# Workspace:  payments-service  (shared)
# Project:    payments-service
```

---

## Managing multiple workspaces

```bash
agentsecrets workspace list
# personal          (your-username)   ← personal
# Acme Eng          (shared)          3 members
# payments-service  (shared)          2 members

agentsecrets workspace switch "Acme Eng"
```

You can belong to and switch between as many workspaces as needed. The active workspace is shown in `agentsecrets status`.