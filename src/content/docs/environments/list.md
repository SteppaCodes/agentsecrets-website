# Listing Environments and Viewing Coverage
detailed explanation of how to list environments and view secrets coverage across environments.


## Listing all environments

```
agentsecrets environment list

Output:
 development   12 secrets   ← active
  staging        8 secrets
  production    12 secrets
```

Shows all three environments, their secret counts, and which one is currently active.


## Reading the coverage output

`agentsecrets secrets list` shows key coverage across all three environments alongside the secrets in the active environment:

```
Environment: development

KEY             DEV   STAGING   PROD
STRIPE_KEY       ✓       ✓        ✓
OPENAI_KEY       ✓       ✓        ✗
DATABASE_URL     ✓       ✗        ✗
```

Each row is a key name. Each column is an environment. A checkmark (✓) or asterisk (*) means the key exists there. An X means it does not.


## Identifying missing keys

Any row with an `X` in staging or production is a gap that needs to be addressed before deploying to that environment. The coverage view lets you see this across all environments without switching context. Run `agentsecrets secrets diff --from development --to production` for a more detailed view of exactly what is missing where.


