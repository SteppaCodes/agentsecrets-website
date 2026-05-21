# Secrets & Sync

The core function of the AgentSecrets API is to coordinate secret synchronization across developers. Because of the zero-knowledge constraint, the API does not handle plaintext secret values. Instead, it acts as a storage layer for client-encrypted secrets wrapped in its own database encryption layer.

---

## The Zero-Knowledge Double-Encryption Model

When you set a secret locally, your client encrypts the secret value before sending it to the backend, while keeping the key name in plaintext to enable search and sync coordination. The backend then applies its own at-rest encryption layer (Fernet) over the client-encrypted value.

```
Plaintext Secret                    Local Encryption (AES-256-GCM)            API JSON Payload
  Key:   STRIPE_KEY   ─────────►    (No local encryption)      ─────────►    {
  Value: sk_live_...                Workspace Symmetric Key                  "project_id": "uuid",
                                                                              "environment": "development",
                                                                              "secrets": {
                                                                                "STRIPE_KEY": "base64_aes_gcm_blob..."
                                                                              }
                                                                             }
```

The database stores the following fields for each secret:
* `id`: UUID of the secret.
* `project_id`: UUID of the project.
* `environment`: The target environment (e.g. `development`).
* `key`: Plaintext key name (stored in uppercase).
* `value`: Doubly-encrypted secret value (client-side AES-256-GCM ciphertext, encrypted again on the server via Fernet).
* `created_at` / `updated_at`: Timestamps.

---

## Synchronization Flow

Secret syncing is done on-demand or through background integration triggers:

### Pushing Secrets

1. The local CLI reads the environment secrets and identifies changes (additions, deletions, updates).
2. It encrypts all modified values using the local Workspace Key.
3. The CLI issues a `POST /api/secrets/` with a dictionary of plaintext keys and encrypted values.
4. The backend encrypts the values with Fernet and updates/inserts the database records.

### Pulling Secrets

1. The local CLI calls `GET /api/secrets/{project_id}/` (optionally specifying environment).
2. The backend decrypts the Fernet layer and returns the client-encrypted blobs.
3. The CLI decrypts the values locally using the stored Workspace Key and updates the local SQLite cache or project `.env` templates.

