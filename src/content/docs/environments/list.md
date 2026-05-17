# Listing Environments and Viewing Coverage
List all environments for the active project with their secret counts and show which one is currently active.


## Listing all environments

```
agentsecrets environment list

Output:
 development   12 secrets   ← active
  staging        8 secrets
  production    12 secrets
```

Shows all three environments, their secret counts, and which one is currently active.

Secret counts are fetched live from the API across all three environments in parallel.


## Reading the coverage output

`agentsecrets secrets list` shows key coverage across all three environments alongside the secrets in the active environment:

```
Environment: development

Key              DEV  STAGING  PROD
DATABASE_URL      *      *      *
OPENAI_KEY        *      *      -
SENDGRID_KEY      *      -      -
STRIPE_KEY        *      *      *

Showing cached keys. Use --remote for latest from cloud.
```

Each row is a key name. Each column is an environment. `*` means the key is present in that environment; `-` means it is absent.


## Identifying missing keys

Any row with an `X` in staging or production is a gap that needs to be addressed before deploying to that environment. The coverage view lets you see this across all environments without switching context. Run `agentsecrets secrets diff --from development --to production` for a more detailed view of exactly what is missing where.


