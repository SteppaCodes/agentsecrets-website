# OpenClaw Integration

AgentSecrets integrates natively with OpenClaw (v2026.2.26 and later) to provide secure credential management. This integration supports both **interactive AI assistant capabilities** (via the AgentSecrets skill) and **non-interactive workflow injection** (via the SecretRef exec provider).

---

## 1. Interactive AI Assistant Skill

By installing the `agentsecrets` skill in OpenClaw, you equip your AI assistants with a zero-knowledge toolset. The assistant can execute API requests with credential injection, list keys, and query status, but it can never see the raw credential values.

### Installation

:::step
1. Install the `agentsecrets` skill directly from ClawHub:
   ```bash
   openclaw skill install agentsecrets
   ```

2. Verify that the skill is active:
   ```bash
   openclaw skill list | grep agentsecrets
   # agentsecrets ✓ active
   ```
:::

### Available Skill Tools

Once installed, the following tools are exposed to OpenClaw assistants:
* **`api_call`**: Executes API calls with secure credential injection at the transport boundary.
* **`list_keys`**: Lists available key names in the active project and environment (metadata only).
* **`get_status`**: Returns current session, workspace details, and active environment.
* **`switch_environment`**: Changes the active environment context.
* **`pull_secrets`**: Synchronizes the local OS Keychain with the cloud backend.

---

## 2. Workflow Secret Injection (SecretRef)

For non-interactive workflow steps and automated tasks, OpenClaw supports the `SecretRef` system. When a step configuration references a key via `SecretRef`, OpenClaw automatically invokes the AgentSecrets exec provider to resolve and inject the key.

### How it Works

:::step
1. **Store the credential** in the local OS Keychain:
   ```bash
   agentsecrets secrets set STRIPE_KEY=sk_live_...
   ```

2. **Add domain authorization** to your workspace allowlist:
   ```bash
   agentsecrets workspace allowlist add api.stripe.com
   ```

3. **Reference the credential** in your OpenClaw workflow YAML file:
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
