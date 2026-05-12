# Using AgentSecrets in CI/CD

## Why CI/CD environments need special handling

Content for this section is coming soon.

## Using agentsecrets env in CI

Content for this section is coming soon.

## GitHub Actions setup

Content for this section is coming soon.

## GitLab CI setup

Content for this section is coming soon.

## Avoiding secrets in pipeline logs

Content for this section is coming soon.

## Service account identity for CI agents

Content for this section is coming soon.

# Using AgentSecrets in CI/CD

For CI/CD pipelines, use the `AGENTSECRETS_ENV` environment variable to set the active environment without modifying `project.json`:

```yaml
# GitHub Actions example
- name: Run agent
  env:
    AGENTSECRETS_ENV: production
  run: |
    agentsecrets login
    agentsecrets secrets pull
    agentsecrets proxy start
    python run_agent.py
```

`AGENTSECRETS_ENV` takes the highest priority in environment resolution, overriding anything set in `project.json` or global config. This makes it safe to run production workflows in CI without modifying any project files.

For service accounts in CI, use issued agent identity with a token stored as a CI secret — not user credentials.

