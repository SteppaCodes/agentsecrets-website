# Inviting Teammates

AgentSecrets is built for secure collaboration. You can grant developers access either at the macro **Workspace** level or at the micro **Project** level.

---

## Workspace-Level Invites

If you invite a teammate to the workspace, they automatically inherit access to **all projects** within that workspace. This is the recommended approach for small-to-medium teams working on a unified codebase or monorepo.

```bash
agentsecrets workspace invite alice@acme.com
```

### The Onboarding Flow
:::step
1. Alice receives an email invitation containing a secure acceptance link.
:::
:::step
2. She clicks the link to authenticate and create her AgentSecrets account.
:::
:::step
3. She installs the CLI and runs `agentsecrets login`.
:::
:::step
4. During login, her local CLI generates her personal cryptographic keypair and establishes trust with the Workspace root key.
:::
:::step
5. She pulls the secrets for any project using `agentsecrets secrets pull`.
:::

---

## Project-Level Invites

If you have external contractors or specialized AI teams, you may want to restrict their access to a single agent's credentials. You can invite them specifically to one project.

```bash
# First, ensure you are in the correct project context
agentsecrets project use "finance-agent"

# Invite the contractor
agentsecrets project invite contractor@external.com
```

> [NOTE]
> Project-level members cannot list or access secrets from other projects in the workspace. The CLI enforces this isolation cryptographically—the synchronization server will not distribute the encrypted blobs of unauthorized projects to their machine.

---

## Listing and Revoking Access

To see who has access to the current project:
```bash
agentsecrets project members
```

To revoke access immediately:
```bash
agentsecrets project remove contractor@external.com
```
When access is revoked, AgentSecrets automatically triggers a background **Re-encryption Envelope** process, ensuring that the revoked user's cached keys are invalidated and current teammates receive new cryptographic keys for future synchronization.
