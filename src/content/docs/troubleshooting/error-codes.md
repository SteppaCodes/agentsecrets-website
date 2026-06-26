---
title: Error Codes Reference
description: Troubleshooting reference for AgentSecrets CLI structured error codes.
---

# Error Codes Reference

When a command in the AgentSecrets CLI fails, it outputs a structured error code (e.g., `[SEC-404]`) instead of a raw system error. This allows you to quickly locate and diagnose the root cause of the failure.

Below is the complete reference of all error codes used in AgentSecrets, including common causes and resolution steps.

---

## Error Codes Index

| Code | Type | Description |
|---|---|---|
| **[SEC-404]** | Security | Secret not found in active environment |
| **[KEY-501]** | Keychain | Operating system keychain / credential manager is locked |
| **[KEY-502]** | Keychain | Headless Linux environment keyring initialization failure |
| **[AUTH-401]** | Auth | Session unauthorized, invalid, or expired |
| **[AUTH-403]** | Auth | Permission denied for the selected workspace |
| **[SRV-500]** | Server | AgentSecrets Cloud service internal server error |
| **[NET-101]** | Network | Remote server connection failed |
| **[NET-102]** | Network | Request timeout |
| **[SYS-403]** | OS | Operating system filesystem permission denied |
| **[SYS-404]** | OS | State directory or configuration file missing |
| **[SEC-403]** | Security | Unapproved binary attempting to access keychain |
| **[LOG-404]** | Audit | Log entry not found in local database |
| **[ERR-999]** | Fallback | Unhandled or unexpected runtime exception |

---

## Error Details & Troubleshooting

### SEC-404: Secret Not Found
* **Description:** The secret key you requested does not exist in your active workspace environment.
* **Common Causes:**
  - Typo in the secret key name (remember: keys are case-sensitive).
  - The secret is set in a different environment than the active one (e.g., set in `staging` but requesting in `development`).
  - Your local keychain cache is out-of-sync with the cloud.
* **Resolution:**
  1. List all available keys in your environment:
     ```bash
     agentsecrets secrets list
     ```
  2. Verify your active environment context:
     ```bash
     agentsecrets status
     ```
  3. Pull the latest secrets from the cloud to update your local cache:
     ```bash
     agentsecrets secrets pull
     ```

### KEY-501: OS Keychain Locked
* **Description:** The operating system's secure credential store is locked or unreachable.
* **Common Causes:**
  - Login keychain locked (macOS).
  - Windows Credential Manager service suspended.
  - Desktop environment keyring locked.
* **Resolution:**
  - Run any command that triggers a keychain unlock prompt (e.g., `agentsecrets status`).
  - Unlock the macOS keychain via Terminal:
    ```bash
    security unlock-keychain ~/Library/Keychains/login.keychain
    ```
  - For Linux users, verify that `gnome-keyring` or `dbus` daemon is active.

### KEY-502: Headless Keyring Unconfigured
* **Description:** Keyring failed to initialize because the shell is running in a headless SSH session without a graphical desktop context.
* **Common Causes:**
  - Running CLI in a headless Linux server, Docker container, or CI/CD runner.
* **Resolution:**
  - Set up a virtual frame buffer or export the DBus session before running the CLI:
    ```bash
    export $(dbus-launch)
    ```
  - Unlock the keyring programmatically on start:
    ```bash
    echo "your-password" | gnome-keyring-daemon --unlock
    ```

### AUTH-401: Session Expired
* **Description:** Your local user session token has expired, been revoked, or is invalid.
* **Common Causes:**
  - It has been more than 7 days since you last logged in.
  - The session was manually terminated from the web dashboard.
* **Resolution:**
  - Authenticate your terminal again:
    ```bash
    agentsecrets login
    ```

### AUTH-403: Workspace Forbidden
* **Description:** Your account has insufficient permissions to modify or access the workspace.
* **Common Causes:**
  - Attempting to push secrets to an environment where your role only allows read-only access (e.g. `production` restricted to admins).
* **Resolution:**
  - Verify your workspace membership role:
    ```bash
    agentsecrets workspace members
    ```
  - Contact a workspace administrator to upgrade your access role.

### SRV-500: Server Internal Error
* **Description:** The remote AgentSecrets backend server encountered an unexpected error.
* **Common Causes:**
  - Database outage, service degradation, or system overload.
* **Resolution:**
  - Wait a few moments and try your command again.
  - If the error persists, copy the report printed in the terminal and send it to `engineering@theseventeen.co`.

### NET-101: Connection Failed
* **Description:** The CLI could not connect to the remote backend server.
* **Common Causes:**
  - No active internet connection.
  - Firewall or VPN blocking outgoing requests to the AgentSecrets API.
* **Resolution:**
  - Check your local network connectivity.
  - Ensure outbound requests to the API domain are not blocked by local security systems.

### NET-102: Request Timeout
* **Description:** The connection timed out before the server could respond.
* **Common Causes:**
  - Exceptionally slow network connection.
  - High server load.
* **Resolution:**
  - Retry the command.
  - If running in a bandwidth-constrained environment, increase your terminal request timeout limit.

### SYS-403: OS Permission Denied
* **Description:** Operating system filesystem permissions blocked access to AgentSecrets' state directory.
* **Common Causes:**
  - The `~/.agentsecrets` directory or configuration files are owned by `root` (e.g. if run with `sudo` previously).
* **Resolution:**
  - Restore correct ownership to your state files:
    ```bash
    sudo chown -R $(whoami) ~/.agentsecrets
    ```

### SYS-404: Config File Missing
* **Description:** A required workspace or project configuration file is missing.
* **Common Causes:**
  - The `project.json` file was deleted from the `.agentsecrets` directory.
  - Running a project-specific command outside of a configured directory.
* **Resolution:**
  - Link this directory to your project again:
    ```bash
    agentsecrets project use
    ```
  - If global configs are missing, regenerate them:
    ```bash
    agentsecrets init
    ```

### SEC-403: Binary Unapproved
* **Description:** The calling binary (e.g. a script, sub-shell, or IDE process) is not registered in your security policy and was blocked from accessing keychain secrets.
* **Common Causes:**
  - An AI agent or unapproved terminal process attempted to read keychain secrets directly.
* **Resolution:**
  - Run the CLI command interactively in your main approved terminal window to trigger the registration prompt.
  - Approve the calling process when prompted by the `keychain-auth` daemon.

### LOG-404: Log Entry Not Found
* **Description:** The requested log ID was not found in your local database.
* **Common Causes:**
  - Specifying the row index number (e.g. `3`) instead of the cryptographic Log ID.
  - The log entry was pruned or belongs to a different workspace environment.
* **Resolution:**
  1. Specify the actual Log ID (e.g., `log_01J0A...`) in the command:
     ```bash
     agentsecrets logs show log_01J0A8B7...
     ```
  2. Use the interactive menu by running `agentsecrets logs list` or `agentsecrets logs` and selecting the row.

### ERR-999: Unexpected Runtime Exception
* **Description:** An unhandled error occurred during CLI execution.
* **Resolution:**
  - Review the exact error details printed in the terminal.
  - Submit a bug report or contact support for help.
