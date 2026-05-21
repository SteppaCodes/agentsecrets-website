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

> [NOTE]
> If you are using AgentSecrets in a CI/CD pipeline, you should use a **Service Token** instead of a user session token. Service tokens can be generated from the Web Dashboard and do not expire unless manually revoked.
