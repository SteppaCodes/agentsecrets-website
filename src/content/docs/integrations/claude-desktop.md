# MCP / Claude Desktop

The MCP integration lets Claude Desktop and Cursor call any authenticated API through AgentSecrets. Claude passes a key name. It never sees the credential value.

## Auto-install (recommended)

```bash
agentsecrets mcp install
```

This detects your Claude Desktop or Cursor installation, writes the MCP config automatically, and confirms what was written.

```
✓ Detected Claude Desktop at ~/Library/Application Support/Claude
✓ Written to claude_desktop_config.json
✓ Restart Claude Desktop to activate
```

Restart Claude Desktop after running this.

## What gets written

```json
{
  "mcpServers": {
    "agentsecrets": {
      "command": "/usr/local/bin/agentsecrets",
      "args": ["mcp", "serve"]
    }
  }
}
```

No `env` block. No credential values. The binary path is the only thing in the config.

## Manual config

If you prefer to edit `claude_desktop_config.json` yourself:

```json
{
  "mcpServers": {
    "agentsecrets": {
      "command": "/usr/local/bin/agentsecrets",
      "args": ["mcp", "serve"]
    }
  }
}
```

Find the config file at:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

## Available MCP Tools

AgentSecrets exposes a robust tool surface to your AI assistants, partitioned into logical operational boundaries:

### 🔑 Credential Operations
* **`api_call`**: Executes an HTTP request with credential injection. Your assistant passes key references; the proxy resolves and injects key values from the OS Keychain at the transport boundary.
* **`list_keys`**: Lists available key names in the active project and environment. Returns metadata only, never actual values.
* **`check_key`**: Checks if a specific key name exists in the active project (optionally checking specific environments).
* **`get_coverage`**: Analyzes key parity across environments (development, staging, production) to identify missing configurations.

### ⚙️ Context & Environment Management
* **`get_status`**: Returns current session expiry, workspace details, active project configuration, background proxy status, keychain-auth configuration, and cached secrets synchronization state.
* **`get_environment`**: Gets the active environment and details on how it was resolved (env var, project config, or global setting).
* **`switch_environment`**: Sets the active environment (requires confirmation in chat).
* **`pull_secrets`**: Triggers a pull to sync local keyring/cache with the cloud backend (requires confirmation in chat).
* **`diff_secrets`**: Compares local keyring cached keys against cloud secrets.
* **`diff_environments`**: Compares key drift between two specified environments (e.g. source vs. target).

### 🔍 Auditing & Governance
* **`get_proxy_logs`**: Queries the local proxy audit database to view recent requests (method, target domain, key name used, status, and duration).
* **`get_blocked_requests`**: Returns blocked outgoing requests (e.g. domains blocked by allowlist).
* **`get_redaction_events`**: Lists requests where credential leakage was detected and values were redacted.
* **`get_audit_summary`**: Retrieves aggregated statistics on proxy usage.

### 🛡️ Access Control & Policy
* **`get_allowlist`**: Returns the list of authorized proxy domains.
* **`check_domain`**: Verifies if a domain is allowed to receive credentials, and returns the CLI command to add it if blocked.
* **`get_agent_identity`**: Checks the active agent's configuration and whether an issued token (`agt_...`) is active.
* **`list_agent_tokens`**: Lists metadata for all issued agent tokens in the workspace.

### 🔄 Key Lifecycle
* **`rotate_key`**: Permanently deletes/rotates a key from the current environment (requires user confirmation).

> [IMPORTANT]
> To preserve the zero-knowledge model, there is no `get_secret` tool. The agent can never retrieve raw key values. Credential names are listed, and the proxy performs injections. Outgoing response bodies are automatically scanned and redacted if secret values are leaked in API responses.

## Using AgentSecrets with Claude

Once the MCP server is active, Claude can make authenticated API calls by name:

```
You: Check my Stripe balance
Claude: [calls api_call with bearer="STRIPE_KEY", url="https://api.stripe.com/v1/balance"]
Claude: Your current balance is $4,200.00 available.
```

Claude saw the balance. It never saw `sk_live_51H...`.
