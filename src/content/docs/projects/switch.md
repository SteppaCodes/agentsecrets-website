# Switching Projects

When managing multiple AI agents or microservices, you need to seamlessly switch your credential context. AgentSecrets handles context switching both explicitly (via commands) and implicitly (via directories).

---

## Explicit Switching

To manually change your active project context, use the CLI:

```bash
# List all available projects
agentsecrets project list

# Switch to a specific project
agentsecrets project use "finance-agent"
```

When you run `agentsecrets project use`, the CLI updates the `.agentsecrets/project.json` file in your current directory to point to the new `projectId`. All subsequent commands—like `agentsecrets secrets set` or `agentsecrets proxy start`—will operate against the `finance-agent` keychain.

---

## Implicit Directory Switching

AgentSecrets is deeply integrated into your filesystem workflow. 

When you execute any command (like `agentsecrets env` or `agentsecrets call`), the CLI traverses up your current directory tree looking for an `.agentsecrets/project.json` file.

This means that if you organize your code into separate directories, context switching is completely automatic:

1. `cd ~/code/billing-api`
   (AgentSecrets automatically detects the billing project config and loads Stripe keys).
2. `cd ~/code/support-agent`
   (AgentSecrets seamlessly drops the billing context and loads the OpenAI keys for the agent).

You never have to manually run `project use` when navigating between properly initialized repositories.

---

## Verifying Your Context

If you are ever unsure which project or environment is currently active in your terminal session, run:

```bash
agentsecrets status
```

This will output your active workspace, current project, active environment, and the synchronization status of your local keychain.
