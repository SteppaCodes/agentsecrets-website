# Importing from .env Files

## Supported .env formats

AgentSecrets reads standard `.env` file format, one `KEY=value` pair per line, `#` for comments, no spaces around the `=`. Quoted values are supported. Multi-line values are not.

```bash
# Supported
STRIPE_KEY=sk_live_51H...
OPENAI_KEY="sk-proj-..."

# Not supported
DATABASE_URL="postgresql://
user:pass@host/db"
```

## Running the import

Run agentsecrets secrets push from your project directory. It reads from `.env.{active_environment}` if it exists, falling back to `.env`.

```bash
agentsecrets secrets push
```

Each key-value pair is encrypted locally and uploaded to the cloud. The values are also written to the OS keychain for the active environment.

To import into a specific environment, switch first:

```bash
agentsecrets environment switch production
agentsecrets secrets push
```


## Handling conflicts and duplicates

If a key already exists in AgentSecrets, push overwrites it with the value from the file. There is no merge prompt, push wins. If you want to preserve the existing cloud value for a specific key, remove it from the .env file before pushing.


## Verifying the import

```bash
agentsecrets secrets list
# Shows key names for the active environment

agentsecrets secrets diff
# Should show no local-only or remote-only entries after a successful push
```

