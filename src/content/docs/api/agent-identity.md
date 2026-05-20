# Agent Identity

In agentic workflows, it is critical to distinguish between actions taken by human developers and actions taken by AI agents. The API provides endpoints to declare agent identities, issue cryptographically scoped agent tokens, and audit their execution.

---

## Agent Registration

Before an AI agent can execute tools or requests under its own name, it must be registered within a workspace or project:

* **Endpoints**: 
  * Workspace-scoped agent: `POST /api/workspaces/{workspace_id}/agents/`
  * Project-scoped agent: `POST /api/workspaces/{workspace_id}/projects/{project_id}/agents/`
* **Payload**:
  ```json
  {
    "name": "Claude-Codebase-Assistant",
    "label": "development-token",
    "expires_in_days": 30
  }
  ```
* **Response**: Returns the registered agent details along with an initial agent token:
  ```json
  {
    "status": "success",
    "message": "Agent created",
    "data": {
      "agent": {
        "id": "agent-uuid",
        "name": "Claude-Codebase-Assistant",
        "project_id": null,
        "token_count": 1,
        "active_token_count": 1,
        "last_used_at": null,
        "created_at": "2026-05-20T22:00:00Z"
      },
      "token": "raw_token_secret_string",
      "token_id": "token-uuid"
    }
  }
  ```

---

## Token Issuance & Lifecycle

Once registered, further cryptographic tokens can be issued, listed, or revoked:

* **Issue Token**: `POST /api/workspaces/{workspace_id}/agents/{registration_id}/tokens/` (Accepts `label` and `expires_in_days`)
* **List Tokens**: `GET /api/workspaces/{workspace_id}/agents/{registration_id}/tokens/`
* **Revoke Token**: `DELETE /api/workspaces/{workspace_id}/agents/{registration_id}/tokens/{token_id}/`

---

## Auditing by Identity

When the credential proxy forwards requests to external APIs, it signs the audit log with the active token:
1. The proxy matches the requests to the current active agent.
2. The proxy sends the audit log containing the `agent_id` or token signature to the backend: `/api/internal/audit/logs/`.
3. The workspace administrator can view precisely which agent used which credentials, and quickly revoke access for compromised or misbehaving agents without affecting other teammates.
