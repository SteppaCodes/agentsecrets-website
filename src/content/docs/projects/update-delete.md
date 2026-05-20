# Updating and Deleting Projects

Managing the lifecycle of your projects is straightforward through the CLI.

---

## Renaming a Project

To update the name of a project, use the update command:

```bash
agentsecrets project update "my-ai-assistant" --name "finance-agent"
```

Project names are primarily for human organization in the dashboard and CLI context. Renaming a project does not change its underlying cryptographic `projectId` and does not break existing local contexts (`.agentsecrets/project.json`) for your teammates.

---

## Deleting a Project

If you are sunsetting an application or an AI agent, you can delete its project entirely.

```bash
agentsecrets project delete "finance-agent"
```

> [WARNING]
> Deletion is immediate and irreversible. It destroys all secrets across all environments (`development`, `staging`, `production`) associated with the project.

When you delete a project, the following teardown occurs:
:::step
1. **Cloud Erase**: All encrypted blobs associated with the project are hard-deleted from the synchronization server.
2. **Local Keychain Purge**: The CLI scrubs all decrypted values belonging to the project from your local OS Keychain.
3. **Teammate Cascade**: The next time your teammates run `agentsecrets secrets pull`, their local CLIs will detect the project deletion and automatically purge the orphaned keys from their local Keychains.
:::
