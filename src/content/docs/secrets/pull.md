# Pulling from Cloud Sync

## What pull does

`agentsecrets secrets pull` downloads the encrypted blobs from the cloud for the active environment, decrypts each one using your workspace key, and writes the values to your local storage. It is how you get secrets onto a new machine or pick up changes a teammate pushed.


## Syncing to the OS keychain

In storage mode 1, pull writes directly to the OS keychain. No file is created on disk. The decrypted values exist only in the keychain, scoped to your user account.
In storage mode 2, pull writes to the OS keychain and also writes the decrypted values to `.env.{environment}` in your project root. In both modes, pull generates `.env.example` with key names and environment annotations but no values — this file is safe to commit.


## Pulling a specific environment

Pull operates on the active environment only. To pull all three:

```bash
agentsecrets environment switch development && agentsecrets secrets pull
agentsecrets environment switch staging && agentsecrets secrets pull
agentsecrets environment switch production && agentsecrets secrets pull
```


## What happens when remote is newer

Pull always takes the remote value. If your local keychain has a newer version of a secret than the cloud, pulling will overwrite your local value with the remote one. Run `agentsecrets secrets diff` before pulling to see what will change. If you have local changes you want to keep, push first.


