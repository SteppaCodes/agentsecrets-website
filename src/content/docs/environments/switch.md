# Switching the Active Environment

## The switch command

```bash
agentsecrets environment switch <environment>
```

Valid values are `development`, `staging`, and `production`. Anything else is rejected with an error listing the valid options.


## What changes when you switch

Switching the active environment changes which secrets the proxy resolves, which cloud blobs push and pull operate on, and which `.env.{environment}` file is read or written in storage mode 2. 

The proxy picks up the new environment on the next call with no restart required. The switch writes to `.agentsecrets/project.json` in the current project directory and to the global config as a fallback. A terminal in a different project directory is unaffected, as each directory has its own pinned environment in its own `project.json`.


## Verifying the active environment

```bash
agentsecrets status
```

The active environment is always shown in the status output. Check it before any operation that touches secrets to confirm you are in the right context.





