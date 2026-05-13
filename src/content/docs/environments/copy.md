# Copying an Environment
Detailed explanation of how to copy the keys of an environment to another environment.


## When to copy an environment

Copy is useful when a new environment should start as a clone of an existing one — same keys, same values. The most common case is setting up staging to mirror development when you are first configuring a project. It is also useful for creating production secrets from an existing environment.


## Running the copy

```bash
agentsecrets environment copy development staging
```

This will copy all the keys from the development environment to the staging environment. If any keys already exist in the staging environment, tyou are prompted to confirm before overwriting:

```
This will overwrite 8 existing secrets in staging. Continue? (y/n):
```

## What is and is not copied

Copy transfers all key names and their encrypted values from the source environment to the destination. The domain allowlist is not copied, it is workspace-scoped and applies to all environments. Environment-specific configuration in project.json is not affected.


