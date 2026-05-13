# Cleaning an Environment

```bash
agentsecrets environment clean
```

## What clean does

`agentsecrets environment clean` deletes all secrets in the active environment, from the OS keychain locally and from the cloud.


## When to use it

Clean is useful when decommissioning a project, resetting a test environment to a known empty state, or removing stale secrets from an environment that is no longer in use. 

It is not the right tool for removing individual secrets, use `agentsecrets secrets delete KEY` for that.


## Irreversible actions warning

Clean is permanent, there is no undo. Deleted secrets cannot be recovered from AgentSecrets. If teammates have already pulled the secrets to their local keychains, those copies remain, clean only removes the cloud blobs and your local keychain entries.

You are prompted to confirm before clean proceeds:

```
This will permanently delete all 12 secrets in production. This cannot be undone. Continue? (y/n):
```

Type y to confirm. Anything else cancels the operation.

