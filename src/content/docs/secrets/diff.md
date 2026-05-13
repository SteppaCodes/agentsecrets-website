# Diffing secrets

```bash
agentsecrets secrets diff
```

Compares your local keychain state against the cloud for the active environment and reports what is out of sync:

```
LOCAL ONLY:   NEW_KEY          ← exists locally, not pushed yet
REMOTE ONLY:  DEPRECATED_KEY   ← exists in cloud, not pulled yet
DIFFERS:      DATABASE_URL     ← remote is newer than local
```

**Local only** means the key exists in your keychain but has not been pushed. 
**Remote only** means it exists in cloud but has not been pulled. 
**Differs** means the remote version is newer. 

Pull to get the latest. Push to share your changes.

`secrets diff` compares encrypted blob metadata — it does not compare plaintext values and does not reveal values in its output.


### Cross-environment diff

```bash
agentsecrets secrets diff --from development --to production
```

Shows which key names exist in one environment but are missing in another. Does not compare values — only key name coverage:

```
In development but missing in production:
  OPENAI_KEY
  DATABASE_URL

In production but missing in development:
  (none)

Present in both:
  STRIPE_KEY
```

This is useful before deploying to production, run it to catch any secrets that exist in development but have not been configured in production yet.