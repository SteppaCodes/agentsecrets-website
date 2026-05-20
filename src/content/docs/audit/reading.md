# Reading Audit Logs

AgentSecrets allows you to inspect your proxy logs instantly via the CLI or the Cloud Dashboard.

---

## Viewing Logs Locally

To view the most recent API calls routed through your local proxy, use the `logs` command:

```bash
agentsecrets proxy logs --last 50
```

This outputs a formatted table directly in your terminal:
```text
TIME      RESULT  METHOD  URL                           KEY         AUTH    STATUS  REASON  DURATION
14:23:01  * OK    GET     api.stripe.com/v1/balance     STRIPE_KEY  bearer  200     -       245ms
14:23:05  x FAIL  POST    api.hacker.com/upload         -           -       403     blocked 12ms
```

To tail the logs in real-time as your agent operates:
```bash
agentsecrets proxy logs --watch
```

---

## Filtering by Agent Identity

If you are running multiple agents (e.g., a multi-agent orchestration framework like CrewAI or AutoGen) through the same proxy, you can filter the logs by the specific agent identity token provided during the request.

```bash
agentsecrets log list --agent "research_agent_01"
```

---

## Identifying Blocked Requests

When the proxy blocks a request—either because the domain is not on the allowlist or because the requested secret does not exist—it logs a failed event.

To view all blocked requests across your workspace:
```bash
agentsecrets workspace allowlist log
```

This is extremely useful when onboarding a new API or auditing an AI agent to see if it is attempting to exfiltrate data to an unauthorized domain.
