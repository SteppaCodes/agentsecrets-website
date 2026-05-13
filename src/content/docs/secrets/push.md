# Pushing to Cloud Sync

## What push does

`agentsecrets secrets push` reads your local secrets for the active environment, encrypts each value client-side using your workspace key, and uploads the encrypted blobs to the cloud. The server receives ciphertext it cannot decrypt. Your workspace key never leaves your machine.
Push is how your secrets become available to teammates and to your other machines.


## How encryption works before leaving your machine

Before any secret leaves your machine, the CLI retrieves the value from the OS keychain, encrypts it using AES-256-GCM with a key derived via Argon2id from your workspace key, generates a fresh nonce for each encryption operation, and uploads the ciphertext, nonce, and authentication tag together as a single blob. The plaintext value and the workspace key are never transmitted.


## Resolving conflicts

Push does not merge, it overwrites. If a remote secret is newer than your local version, pushing will replace the remote value with your local one. Run `agentsecrets secrets diff` before pushing to see exactly what will change. If remote is newer and you want to keep it, pull first, then make your changes, then push.


## Pushing a specific environment

Push operates on the active environment only. To push all three environments:

```bash
agentsecrets environment switch development && agentsecrets secrets push
agentsecrets environment switch staging && agentsecrets secrets push
agentsecrets environment switch production && agentsecrets secrets push
```
