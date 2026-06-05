---
title: "Using AgentSecrets with Cursor"
description: "How to configure Cursor to use the native AgentSecrets MCP server for zero-knowledge credential injection."
---

# Using AgentSecrets with Cursor

Cursor has native support for the Model Context Protocol (MCP). By using the native AgentSecrets MCP server, you can allow Cursor's agent to execute tools that require authenticated API access **without ever pasting your API keys into Cursor or exposed configuration files**.

---

## Setup Instructions

### 1. Store Credentials
Ensure you have stored your credentials in your local OS Keychain via the AgentSecrets CLI:
```bash
agentsecrets secrets set STRIPE_KEY=sk_live_...
```

### 2. Auto-Configure Cursor
Run the native `mcp install` command to automatically register AgentSecrets with your local Cursor editor:
```bash
agentsecrets mcp install
```
This automatically detects your Cursor configuration directory and adds the AgentSecrets MCP definition to your Cursor `mcp.json` file.

### 3. Restart Cursor
Restart the Cursor application to load the new MCP server configurations.

---

## Verifying the Connection

Once Cursor restarts, verify the connection status:
1. Open Cursor Settings (`Cmd/Ctrl + Shift + J` or click the gear icon in the top right).
2. Navigate to **Features > MCP**.
3. You should see `agentsecrets` listed as an active MCP server with a **green status indicator**, showing that the stdio server is running and ready.

---

## How it Works in Cursor

You can test the integration directly within Cursor Chat or Cursor Composer. For example, ask Cursor:
> "Can you retrieve my Stripe balance?"

Cursor's agent will run the built-in `api_call` tool, passing `"STRIPE_KEY"` as the key reference:
1. The built-in MCP server receives the request and calls the local proxy layer.
2. The proxy verifies the target domain (`api.stripe.com`) against the allowlist.
3. The proxy resolves the key value securely from your OS Keychain, injects it into the outbound request's headers, and executes the call.
4. The proxy scans the API response, redacts any echoes of the credential, and returns only the clean response body to Cursor.

Cursor receives the data it needs to continue working, but the actual key value never enters the Cursor process space or logs.
