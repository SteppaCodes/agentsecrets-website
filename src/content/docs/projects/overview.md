# Projects

Projects partition secrets within a workspace. Each project has its own set of secrets across all three environments.

```bash
agentsecrets project create payments-service
agentsecrets project create auth-service
agentsecrets project create data-pipeline

# Switch active project
agentsecrets project use payments-service

# List all projects in the current workspace
agentsecrets project list
```

---

## Project audit logs

To view the audit trail of credential operations restricted specifically to the active project:

```bash
agentsecrets project logs
```

Similar to workspace-level logs, if the active workspace is **Shared**, the CLI pulls the project's audit logs from the central server. If the active workspace is **Personal**, it retrieves them from the local audit database.

