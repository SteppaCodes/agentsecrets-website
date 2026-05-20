# Organizing Projects

Because AgentSecrets partitions credentials by project, deciding how to map your codebase to AgentSecrets projects is an important architectural decision.

There are two primary patterns: **The Monorepo Pattern** and **The Microservices Pattern**.

---

## The Monorepo Pattern (1:1 Mapping)

If your entire codebase—including your web app, background workers, and AI agents—resides in a single git repository, the simplest approach is to create a single AgentSecrets project.

```bash
agentsecrets project create "acme-corp-monorepo"
```

**Advantages**:
- You only have one `.agentsecrets/project.json` file in the root of your repository.
- Developers only need to run `agentsecrets secrets pull` once to sync all necessary credentials.
- Extremely low friction for fast-moving teams.

**Tradeoffs**:
- All developers see all secrets. The web developers will have access to the AI agent's OpenAI keys, and the AI developers will have access to the core database passwords.

---

## The Microservices Pattern (1:N Mapping)

If your infrastructure is highly decoupled, or if you want to enforce strict principle-of-least-privilege access, you should create multiple AgentSecrets projects.

```bash
agentsecrets project create "core-api"
agentsecrets project create "billing-service"
agentsecrets project create "support-agent"
```

**Advantages**:
- **Granular Access Control**: You can invite the AI team only to the `support-agent` project, ensuring they do not have access to the `billing-service` Stripe keys.
- **Blast Radius Reduction**: If the `support-agent` server is compromised, the attacker cannot pivot to database credentials belonging to the `core-api`.

**Implementation**:
In a multi-project setup, you will place the `.agentsecrets/project.json` file inside each respective service's subdirectory. When a developer `cd`s into the `billing-service/` folder, the AgentSecrets CLI automatically switches their context to the Billing project.

> [TIP]
> If you are using a microservices pattern in a monorepo workspace (e.g., Turborepo or Nx), run `agentsecrets project use <name>` inside each specific package directory. AgentSecrets correctly resolves the closest `project.json` by traversing up the directory tree.
