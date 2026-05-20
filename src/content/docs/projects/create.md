# Creating Projects

Projects are the primary organizational units in AgentSecrets. They map directly to your applications, microservices, or individual AI agents. Every secret you store is partitioned within a specific project.

---

## Initializing a Project

To create a new project in your active workspace, use the CLI:

```bash
agentsecrets project create "my-ai-assistant"
```

When you run this command, AgentSecrets performs several local actions:
:::step
1. **Cloud Registration**: It registers the project ID securely in your cloud workspace.
2. **Context Creation**: It generates a local `.agentsecrets/project.json` file in your current working directory.
3. **Environment Provisioning**: It provisions three default environments (`development`, `staging`, `production`) and automatically switches your context to `development`.
:::

---

## The Local Context (`project.json`)

When you create or link a project, AgentSecrets drops a `project.json` file inside the `.agentsecrets/` directory. 

This file is purely metadata. It does **not** contain any secrets, cryptographic keys, or sensitive values. It looks like this:

```json
{
  "projectId": "prj_9x2bVxyz",
  "workspaceId": "ws_1aB9cDef",
  "environment": "development"
}
```

> [TIP]
> **Commit this file.** We highly recommend committing `.agentsecrets/project.json` to your git repository. When other developers clone your repository, the AgentSecrets CLI will automatically detect this context and link their local machine to the correct project without requiring manual setup.
