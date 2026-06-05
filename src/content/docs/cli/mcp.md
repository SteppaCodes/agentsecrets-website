---
title: "mcp"
description: "How to use the Model Context Protocol (MCP) subsystem in AgentSecrets v3.0.0."
---

# mcp Subsystem

AgentSecrets v3.0.0 ships with a built-in Model Context Protocol (MCP) server. This allows LLMs and AI clients (like Claude Desktop, Cursor, or Windsurf) to securely list credential keys, check status, switch environments, and make authenticated API calls through the proxy firewall.

---

## Commands

### `agentsecrets mcp install`
Automatically detects and configures local AI clients to use the native AgentSecrets MCP server.
```bash
agentsecrets mcp install
```
* **Supported Editors/Clients**: Claude Desktop, Cursor, and OpenClaw.
* **Mechanism**: Detects configuration directories and writes the stdio server execution configuration.

### `agentsecrets mcp serve`
Starts the stdio-based MCP server.
```bash
agentsecrets mcp serve
```
> [NOTE]
> This command is called automatically by your AI client's MCP manager. You do not need to run this manually.

---

## Exposed MCP Tools

When registered, the MCP server exposes the following tools to the AI assistant:

### 🔑 Credential Operations

#### `api_call`
Allows the agent to execute an authenticated request. Plaintext credentials are resolved from the OS Keychain and injected at the transport layer by the local proxy.
* **Arguments**:
  - `url` (required): Target API URL (e.g. `https://api.stripe.com/v1/charges`).
  - `method` (optional): `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
  - `body` (optional): Request payload string.
  - `headers` (optional): Key-value pairs for extra headers.
  - `injections` (required): Map of injection locations to secret key names. Supported formats:
    - `"bearer": "SECRET_KEY"`
    - `"basic": "SECRET_KEY"`
    - `"header:Header-Name": "SECRET_KEY"`
    - `"query:param_name": "SECRET_KEY"`
    - `"body:json.path": "SECRET_KEY"`
    - `"form:field_name": "SECRET_KEY"`

#### `list_keys`
Lists the names of all secrets available in the active project and environment. This lists key names only, ensuring values are never exposed.

#### `check_key`
Checks if a specific secret key name exists in the active environment.

#### `get_coverage`
Retrieves a table of secret keys and shows which environments (`development`, `staging`, `production`) they are set in.

---

### ⚙️ Context Management

#### `get_status`
Retrieves the active user session email, current project details, and the selected workspace.

#### `get_environment`
Gets the name of the active environment (e.g., `development`).

#### `switch_environment`
Switches the active CLI/proxy environment to `development`, `staging`, or `production`.

#### `pull_secrets`
Pulls the latest encrypted secrets from the cloud sync service to update the local OS Keychain cache.

#### `diff_secrets`
Compares local OS Keychain cached keys with the cloud sync service to detect drifts.

#### `diff_environments`
Compares secret keys between two environments (e.g. comparing development vs production).

---

### 🛡️ Audit & Allowlist

#### `get_proxy_logs`
Returns the recent entries of the local proxy audit log (times, endpoints, key names, and HTTP statuses; values are never logged).

#### `get_blocked_requests`
Lists outbound requests blocked by the proxy firewall (due to allowlist violations, capabilities, or constraints).

#### `get_redaction_events`
Lists events where the proxy detected reflected credential values in responses and redacted them.

#### `check_domain`
Checks if a target domain is authorized in the workspace allowlist.

#### `get_allowlist`
Lists the authorized target domains in the workspace allowlist.
