---
title: "Using AgentSecrets with OpenClaw"
description: "How to configure OpenClaw to manage credentials autonomously using the native AgentSecrets skill and SecretRef exec provider."
---

# Using AgentSecrets with OpenClaw

AgentSecrets integrates natively with OpenClaw (v2026.2.26 and later) to provide secure credential management. This integration supports both **interactive AI assistant capabilities** (via the AgentSecrets skill) and **non-interactive workflow injection** (via the SecretRef exec provider).

---

## 1. Interactive AI Assistant Skill

The `agentsecrets` skill for OpenClaw (published on ClawHub) is an assistant profile that configures the rules, prompts, and CLI dependencies for the OpenClaw AI assistant. It empowers the assistant to interact with AgentSecrets directly on the host machine.

Because OpenClaw assistants execute local terminal commands, the assistant can autonomously manage your credentials lifecycle. It can inspect configuration status, list key metadata, perform diffs, and sync changes (push/pull) with your cloud backend. The agent never sees the decrypted secret values, upholding the zero-knowledge security model.

### 1. Install the Skill
:::step
Install the skill from ClawHub:
```bash
openclaw skill install agentsecrets
```
:::

### 2. Verify Installation
:::step
Verify that the skill is registered and active:
```bash
openclaw skill list | grep agentsecrets
# agentsecrets active
```
:::

### Autonomous Assistant Capabilities

Once the skill is active, the assistant understands how to execute AgentSecrets CLI commands on your behalf to manage your workflow. It can run:

* **Status queries**: Runs `agentsecrets status` to verify the active project, workspace, and environment context.
* **Secret listing & diffs**: Runs `agentsecrets secrets list` and `agentsecrets secrets diff` to inspect keys (names only) and detect drifted configurations.
* **Syncing**: Runs `agentsecrets secrets pull` and `agentsecrets secrets push` to synchronize local OS Keychain states with the remote sync service.
* **Environment switches**: Runs `agentsecrets environment switch <env>` to swap active contexts.
* **Secure API calls**: Runs `agentsecrets call --url <url> --bearer <key>` to execute API requests with secure credential injection at the transport boundary.

> [NOTE]
> Sensitive write operations like setting a key (`agentsecrets secrets set`) require direct user password confirmation and cannot be fully automated without human gating. The assistant will guide you to run the set command in your local terminal.

---

## 2. Workflow Secret Injection (SecretRef)

For non-interactive workflow steps and automated tasks, OpenClaw supports the `SecretRef` system. When a step configuration references a key via `SecretRef`, OpenClaw automatically invokes the AgentSecrets exec provider to resolve and inject the key.

### 1. Store Credentials
:::step
Store the credential in the local OS Keychain:
```bash
agentsecrets secrets set STRIPE_KEY=sk_live_...
```
:::

### 2. Add Domain Authorization
:::step
Add the destination API domain to the allowlist:
```bash
agentsecrets workspace allowlist add api.stripe.com
```
:::

### 3. Reference the Secret
:::step
Reference the credential in your OpenClaw workflow YAML file:
```yaml
steps:
  - name: fetch-charges
    skill: standard-http
    inputs:
      url: https://api.stripe.com/v1/charges
      auth:
        secret_ref: STRIPE_KEY
```
:::

Behind the scenes, when this step executes, OpenClaw runs `agentsecrets exec` internally. The AgentSecrets binary reads the secret reference, resolves the value from the OS Keychain, performs the injection, and returns the response safely. Plaintext values are never written to any OpenClaw configuration file or workflow log.

---

## 3. Environment Injection (Process Spawning)

If you are running legacy OpenClaw workflows that do not support `SecretRef` and instead look up keys from environment variables, you can spawn the OpenClaw process using the `agentsecrets env` wrapper:

```bash
agentsecrets env -- openclaw run my-workflow
```

This resolves the credentials from your local OS Keychain and injects them as standard environment variables directly into the child process at launch time.
