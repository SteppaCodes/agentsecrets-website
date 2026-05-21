# Multi-Agent Systems

When orchestrating multiple AI agents (e.g., a Researcher, a Writer, and a Reviewer) in frameworks like AutoGen or CrewAI, managing credentials becomes highly complex.

If you inject secrets via environment variables, *every* agent has access to *every* secret, violating the principle of least privilege.

## Agent Identity

AgentSecrets solves this with **Agent Identity**. 

You can configure the proxy to require cryptographically signed Agent Tokens. Each agent is issued a unique identity, and the proxy enforces Access Control Lists (ACLs) to ensure the Researcher agent can only resolve `SEARCH_API_KEY`, while the Writer agent can only resolve `CMS_API_KEY`.

### Example (Python SDK)

```python
from agentsecrets import AgentSecrets

# Initialize with the specific Agent Token
researcher_client = AgentSecrets(agent_token="agt_researcher_xyz")
writer_client = AgentSecrets(agent_token="agt_writer_abc")

# This succeeds
researcher_client.call("https://api.search.com", bearer="SEARCH_API_KEY")

# This will result in a 403 Forbidden by the Proxy
# because the Writer agent is not authorized to use the SEARCH_API_KEY
writer_client.call("https://api.search.com", bearer="SEARCH_API_KEY")
```

For more details on setting up cryptographic agent identities, refer to the [Agent Identity Overview](/docs/concepts/agent-identity).
