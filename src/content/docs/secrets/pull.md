# Pulling from Cloud Sync

## What pull does

Content for this section is coming soon.

## Syncing to the OS keychain

Content for this section is coming soon.

## Pulling a specific environment

Content for this section is coming soon.

## What happens when remote is newer

Content for this section is coming soon.

# Pulling from cloud sync

```bash
agentsecrets secrets pull
```

Downloads encrypted blobs from the cloud for the active environment, decrypts them using your workspace key, and writes to the OS keychain in mode 1, or to both the OS keychain and `.env.{environment}` in mode 2.

In both modes, `secrets pull` also generates `.env.example` with key names and environment annotations — no values, just names. This is safe to commit and useful for documenting which keys a project requires.
