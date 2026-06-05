# Zero-Knowledge Cloud Sync

AgentSecrets provides cloud synchronization so teams can share credentials across machines. However, the cloud sync is built on a zero-knowledge architecture.

## The Problem with Centralized Secrets

Traditional cloud secrets managers store your credentials in their database. Even if they encrypt the data at rest, the service provider holds the encryption keys. If the service is compromised, or a rogue employee accesses the database, your secrets are exposed.

## The AgentSecrets E2EE Solution

AgentSecrets does not hold your keys.

When you run `agentsecrets secrets push`, your local CLI encrypts the payload using AES-256-GCM with a key that exists only on your machine. The payload sent over the network is mathematically indistinguishable from random noise.

### What the server sees:
- Workspace ID
- Project ID
- Environment ID
- The timestamp of the push
- The ciphertext blob

### What the server CANNOT see:
- The names of your secrets (e.g., `STRIPE_KEY`)
- The values of your secrets
- The number of secrets in the payload

## Offline Mode

Because the encryption and decryption happen entirely locally, the AgentSecrets proxy does not require an active internet connection to the AgentSecrets API to function. 

As long as the secrets have been pulled and stored in the native OS Keychain, the proxy can resolve and inject credentials completely offline.
