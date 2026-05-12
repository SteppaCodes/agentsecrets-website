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

Local only means the key exists in your keychain but has not been pushed. Remote only means it exists in cloud but has not been pulled. Differs means the remote version is newer. Run `secrets pull` to resolve all three states.

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
```

Use this before deploying to production to catch missing credentials before they cause runtime errors.