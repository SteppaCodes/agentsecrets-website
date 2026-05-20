# LangChain Native Integration (Coming Soon)

AgentSecrets is building a native `BaseTool` implementation for LangChain and LangGraph.

When building complex agentic workflows in LangChain, tools often require extensive access to third-party APIs. Passing these credentials via environment variables exposes them to potential leakage via LLM context windows or malicious tool arguments.

## How it will work

The native integration will provide an `AgentSecretsTool` class that handles HTTP routing through the local proxy automatically.

### Example Preview

```python
from langchain.agents import initialize_agent, AgentType
from langchain.llms import OpenAI
from agentsecrets.integrations.langchain import AgentSecretsTool

# Define a tool that requires authentication
github_repo_tool = AgentSecretsTool(
    name="GitHub Repo Fetcher",
    description="Fetches a list of repositories for a user",
    endpoint="https://api.github.com/users/{username}/repos",
    method="GET",
    auth_type="bearer",
    key_name="GITHUB_TOKEN" # Key name only, value stays in OS keychain
)

llm = OpenAI(temperature=0)
agent = initialize_agent(
    tools=[github_repo_tool], 
    llm=llm, 
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION
)

agent.run("What repositories does The-17 own on GitHub?")
```

> [TIP]
> This integration is currently in early beta. In the meantime, you can build custom LangChain tools by subclassing `BaseTool` and making requests using the standard `agentsecrets` Python client.
