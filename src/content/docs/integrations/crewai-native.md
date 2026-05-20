# CrewAI Integration

CrewAI allows you to orchestrate autonomous AI agents. By integrating AgentSecrets, your CrewAI agents can execute actions against authenticated external APIs without risking credential exposure during tool execution or agent reasoning loops.

---

## Securing CrewAI Tools

CrewAI tools are fundamentally Python functions or classes. To secure them, replace any direct environment variable lookups (`os.getenv`) with calls routed through the AgentSecrets local proxy.

### Example: A Zero-Knowledge GitHub Tool

:::step
1. **Store your credential**:
   ```bash
   agentsecrets secrets set GITHUB_TOKEN=ghp_abc123...
   ```
:::
:::step
2. **Authorize the domain**:
   ```bash
   agentsecrets workspace allowlist add api.github.com
   ```
:::
:::step
3. **Build the CrewAI Tool**:
:::

   ```python
   import requests
   from crewai.tools import BaseTool

   class FetchGitHubIssuesTool(BaseTool):
       name: str = "fetch_github_issues"
       description: str = "Fetches the latest open issues from a GitHub repository."

       def _run(self, repo_name: str) -> str:
           # Define proxy routing headers
           headers = {
               "X-AS-Target-URL": f"https://api.github.com/repos/{repo_name}/issues",
               "X-AS-Inject-Bearer": "GITHUB_TOKEN",
               "Accept": "application/vnd.github.v3+json"
           }
           
           # Make the request through AgentSecrets
           response = requests.get(
               "http://localhost:8765/proxy",
               headers=headers
           )
           
           if response.status_code == 200:
               return response.text
           return f"Failed to fetch issues: {response.status_code}"
   ```

When your CrewAI agent decides to use the `FetchGitHubIssuesTool`, it provides the `repo_name` argument. The tool sends the request to the local AgentSecrets proxy, which resolves `GITHUB_TOKEN` from your OS Keychain, injects it, and forwards it to GitHub. The agent only receives the JSON list of issues.

---

## Native CrewAI SDK (Coming Soon)

A native `crewai-agentsecrets` extension is currently in development. It will provide base tool classes that automatically inherit zero-knowledge network routing. Until it is available, the standard HTTP proxy method is fully supported and recommended.
