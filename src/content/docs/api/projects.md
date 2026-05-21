# Projects

A **Project** is a logical container within a Workspace. Projects group credentials and secrets for specific repositories, services, or environments.

---

## Project Model

Each Project consists of:
* A unique UUID identifier.
* A name (e.g. `frontend-app` or `billing-service`).
* The Workspace ID it belongs to.
* Inherited workspace membership permissions (access is governed by workspace roles, with no project-specific access control lists).

---

## Workspace-Project Hierarchy

```
   Workspace (Tenant Boundary)
        │
        ├── Project A (e.g., Stripe Payment Gateway)
        │     ├── dev environment
        │     ├── staging environment
        │     └── production environment
        │
        └── Project B (e.g., Data Analytics Pipeline)
              ├── dev environment
              └── production environment
```

* Workspaces represent the billing and organizational boundaries (e.g., your company or department).
* Projects represent individual software services or codebases.
* Secrets belong to a specific project and environment (e.g., Project A -> Production environment -> `STRIPE_API_KEY`).

---

## Project Endpoints

The API exposes the following endpoints for projects:

* **List Projects**: `GET /api/projects/` (Lists projects in the active workspace context).
* **Create Project**: `POST /api/projects/`
* **Get Project Details**: `GET /api/projects/{workspace_id}/{project_name}/` or `GET /api/projects/{project_name}/`
* **Update Project**: `PATCH /api/projects/{workspace_id}/{project_name}/` or `PATCH /api/projects/{project_name}/`
* **Delete Project**: `DELETE /api/projects/{workspace_id}/{project_name}/` or `DELETE /api/projects/{project_name}/`
* **Project Invite**: `POST /api/projects/{workspace_id}/{project_name}/invite/` (Used to delegate project access to specific workspace members).
* **Environment Counts**: `GET /api/projects/{project_id}/environments/` (Returns the number of secrets defined in each environment).
* **Secret Coverage**: `GET /api/projects/{project_id}/secrets/coverage/` (Details key coverage across environments).
* **Secret Diff**: `GET /api/projects/{project_id}/secrets/diff/` (Details differences in key presence across environments).
