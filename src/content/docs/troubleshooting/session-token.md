# Session Token Errors

If you encounter `401 Unauthorized` errors related to "Invalid or Expired Session Token", your CLI session has expired.

## Understanding Sessions

When you run `agentsecrets login`, the CLI authenticates with the AgentSecrets API and stores a short-lived session token locally. This token is required to synchronize encrypted blobs to the cloud.

For security, session tokens expire after 7 days of inactivity.

## How to Fix

Simply log in again to refresh your token:

```bash
agentsecrets login
```

Your local keychain (containing your actual encrypted values) is never deleted when a session expires. You will not lose any secrets; you simply need to re-authenticate to push or pull changes.

## Force Resetting a Session (Logging Out)

If you need to manually clear your session (for example, to switch users or force a clean login state), do not attempt to delete local configuration files:
* **Do not delete `token.json`**: In v3.0.0, user session tokens are stored securely in the native OS Keychain. Deleting the file on disk will not log you out.
* **Use the logout command**: Run the following command to securely wipe the session token from your OS Keychain:
  ```bash
  agentsecrets logout
  ```



