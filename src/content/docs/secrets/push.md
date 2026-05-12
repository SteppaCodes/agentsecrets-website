# Pushing to Cloud Sync

## What push does

Content for this section is coming soon.

## How encryption works before leaving your machine

Content for this section is coming soon.

## Resolving conflicts

Content for this section is coming soon.

## Pushing a specific environment

Content for this section is coming soon.

# Syncing Secrets with Cloud

AgentSecrets uses zero-knowledge cloud sync to share secrets across machines and teammates. Secrets are encrypted client-side before upload. The server holds ciphertext it cannot decrypt. Push sends your local secrets to the cloud. Pull brings cloud secrets to your local keychain.

---

## Pushing to cloud sync

```bash
agentsecrets secrets push
```

Reads secrets from your local storage (keychain in mode 1, `.env.{environment}` in mode 2), encrypts them client-side using your workspace key, and uploads the encrypted blobs to the cloud.

Push operates on the active environment. To push all three environments, switch and push for each:

```bash
agentsecrets environment switch development && agentsecrets secrets push
agentsecrets environment switch staging && agentsecrets secrets push
agentsecrets environment switch production && agentsecrets secrets push
```
