# CrewAI Native Integration (Coming Soon)

AgentSecrets is currently building a native, drop-in integration for CrewAI. 

CrewAI's architecture relies on autonomous agents utilizing tools to accomplish tasks. Currently, most CrewAI developers pass API keys into agent environments using `.env` files or direct hardcoding.

## The Upcoming Integration

With the native integration, you will simply wrap your CrewAI execution block with the `AgentSecrets` SDK context manager or decorator.

### Example Preview

```python
from crewai import Agent, Task, Crew
from agentsecrets import AgentSecrets

# Initialize the proxy client
client = AgentSecrets()

# Define your tools using key names, not values
@tool
def fetch_user_data(user_id: str):
    """Fetches user data from the CRM API."""
    response = client.call(
        f"https://api.crm.example.com/users/{user_id}",
        bearer="CRM_API_KEY" # Reference only!
    )
    return response.json()

# Create your agents
researcher = Agent(
    role='CRM Researcher',
    goal='Gather complete user context',
    tools=[fetch_user_data],
    verbose=True
)

# ... define tasks and crew ...

# Run the crew
result = crew.kickoff()
```

By doing this, even if the `researcher` agent attempts to dump its context or experiences prompt injection from user data, the `CRM_API_KEY` value is physically not present in the Python process memory to be leaked.

> [NOTE]
> This integration is in active development. If you need CrewAI support immediately, you can use the `AgentSecrets` Python SDK directly within your custom tools today.
