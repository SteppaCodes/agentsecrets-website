# CI/CD Integration

AgentSecrets can be utilized seamlessly in Continuous Integration and Continuous Deployment (CI/CD) pipelines to securely inject testing or deployment credentials without exposing them in CI configuration files or job runners.

---

## The Workflow

In a CI/CD environment, you typically run AgentSecrets in **Environment Injection** mode (`agentsecrets env --`). 

Because CI environments are ephemeral and headless, you authenticate the AgentSecrets CLI by issuing an Agent Token, injecting it via a single repository secret, and running your test suite.

---

## Step-by-Step CI/CD Configuration

### 1. Issue a CI Token
From your local machine, generate a token for your CI environment (e.g. staging or production):
```bash
agentsecrets identity issue --name "github-actions-ci" --role editor
```
*Note: Save the output token (`ws01...`). It will only be shown once.*

### 2. Add the Token to your CI Provider
Store the token as a masked repository secret in your CI provider (e.g., GitHub Secrets, GitLab CI Variables, or AWS CodePipeline parameters). Name the variable `AGENTSECRETS_TOKEN`.

### 3. Update your Pipeline Configuration

#### Example: GitHub Actions

```yaml
name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        
    - name: Install AgentSecrets CLI
      run: npm install -g @the-17/agentsecrets
      
    - name: Install Dependencies
      run: npm ci
      
    - name: Run Tests with Zero-Knowledge Injection
      env:
        # The CLI automatically detects this environment variable for authentication
        AGENTSECRETS_TOKEN: ${{ secrets.AGENTSECRETS_TOKEN }}
      run: |
        # Injects the latest secrets directly into the test suite memory
        agentsecrets env -- npm test
```

#### Example: GitLab CI

```yaml
stages:
  - test

run_tests:
  stage: test
  image: node:18
  before_script:
    - npm install -g @the-17/agentsecrets
    - npm ci
  script:
    # AGENTSECRETS_TOKEN is defined in GitLab CI/CD Variables
    - agentsecrets env -- npm test
```

---

## Security Benefits in CI

- **No Plaintext Syncing**: Test suites and deploy scripts fetch the latest encrypted credentials dynamically at runtime. If a secret is rotated centrally, the next CI job automatically receives the new key without requiring manual updates to GitHub Secrets.
- **Audit Trails**: Every CI/CD run that pulls credentials generates an audit log attributed to the `"github-actions-ci"` agent token, ensuring compliance and visibility into pipeline secret consumption.
