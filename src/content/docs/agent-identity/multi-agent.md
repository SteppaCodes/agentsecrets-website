# Multi-Agent Systems

In complex multi-agent architectures (such as swarms or pipelines built with LangGraph, CrewAI, or AutoGen), multiple specialized agents collaborate to complete tasks. For example, a *Researcher* retrieves raw data, a *Writer* consolidates it, and a *Publisher* pushes it to a CMS.

If these agents share a single flat pool of environment variables, any vulnerability in one agent compromises the credentials of all agents. Integrating Agent Identity into your orchestrations mitigates this risk by enforcing strict segregation and distinct audit paths.

---

## Assigning unique identity to each agent

The recommended design pattern for multi-agent systems is to instantiate separate `AgentSecrets` client objects or proxy configurations for each agent role, rather than sharing a single global client.

### 1. Issue tokens for each agent role
:::step
Generate separate cryptographic tokens for each agent in your swarm:

```bash
agentsecrets agent token issue "swarm-researcher"
agentsecrets agent token issue "swarm-writer"
agentsecrets agent token issue "swarm-publisher"
```
:::

### 2. Configure the SDK clients
:::step
Instantiate separate client instances in your orchestration code:

```python
from agentsecrets import AgentSecrets
:::

# Researcher uses search/database keys
researcher_secrets = AgentSecrets(
    project="content-swarm",
    agent_token="agt_ws01hxyz_researcherToken..."
)

# Writer uses translation/formatting keys
writer_secrets = AgentSecrets(
    project="content-swarm",
    agent_token="agt_ws01hxyz_writerToken..."
)

# Publisher uses CMS/Social media keys
publisher_secrets = AgentSecrets(
    project="content-swarm",
    agent_token="agt_ws01hxyz_publisherToken..."
)
```

### 3. Attach secrets clients to agent tools
:::step
Ensure each agent's tool executable block uses its designated secrets client:

```python
:::
# researcher_tools.py
@tool
def search_web(query: str) -> str:
    """Search the web for research topics."""
    # Resolve the API key through the researcher client
    response = researcher_secrets.call(
        url=f"https://api.serpapi.com/search?q={query}",
        bearer="SERP_API_KEY"
    )
    return response.json()
```

---

## Per-agent audit trails

Once agents are configured with unique tokens, their HTTP calls are logged with granular precision. This allows security engineers to see the logical flow of data and secret consumption:

```
TIMESTAMP  AGENT              METHOD  TARGET URL                      KEY             STATUS
10:15:02   swarm-researcher   GET     api.serpapi.com/search          SERP_API_KEY    200 OK
10:15:20   swarm-writer       POST    api.openai.com/v1/chat          OPENAI_KEY      200 OK
10:15:45   swarm-publisher    POST    api.wordpress.org/v2/posts      WP_APP_KEY      201 Created
```

If an error or credential over-use occurs, you can instantly pinpoint the responsible agent rather than searching through a unified application log.

---

## Revoking one agent in a fleet

If an LLM running the `swarm-researcher` is exploited via prompt injection (e.g., directed to scan a malicious site that instructs the agent to dump all available environment secrets), the attacker might attempt to scrape credentials.

Because AgentSecrets does not expose plaintext values to the agent's runtime memory, the attacker cannot read the key. However, the agent might still be forced to make unauthorized outbound requests. 

When you detect this anomaly:

### 1. Identify the compromised agent token
:::step
Run the list command to find the active token ID:
```bash
agentsecrets agent token list "swarm-researcher"
```
:::

### 2. Revoke the token
:::step
Revoke the Researcher's token immediately:
```bash
agentsecrets agent token revoke tok_researcher_id --agent="swarm-researcher"
```

The `swarm-researcher` is immediately locked out from resolving any credentials through the proxy. However, the `swarm-writer` and `swarm-publisher` continue operating normally. Your application remains partially active, avoiding a complete service outage while you patch the prompt injection vulnerability.
:::

---

## Identity patterns for agent pipelines

When building production pipelines, developers use three main patterns to propagate identity:

### 1. Explicit Dependency Injection
:::step
Pass the scoped `AgentSecrets` client directly into the constructor of your agent class or tool definitions. This is the most robust and readable pattern.
:::

### 2. Context Variables (Async propagation)
:::step
In asynchronous Python applications (e.g., using FastAPI or Celery), use `contextvars` to store the active agent's token for the duration of a task execution. The proxy transport hook can automatically pull this token and attach it to the `X-AS-Agent-Token` request header:

```python
import contextvars
import httpx

active_agent_token = contextvars.ContextVar("active_agent_token")
:::

# httpx Client event hook
def inject_agent_identity(request: httpx.Request):
    try:
        token = active_agent_token.get()
        request.headers["X-AS-Agent-Token"] = token
    except LookupError:
        pass  # Fall back to anonymous or declared environment variables
```

### 3. Sidecar Header Routing
:::step
If you run agents in independent microservice containers, configure a single central Credential Proxy sidecar per node. Each container injects its agent-specific environment variable (`AGENTSECRETS_TOKEN`) when spawned, ensuring the local proxy maps the traffic correctly.

> [TIP]
> Always assign the most restrictive workspace and environment contexts to each agent container. Combining workspace-level allowlists with per-agent tokens ensures a secure defense-in-depth model.
:::
