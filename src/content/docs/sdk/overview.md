# SDK Overview

AgentSecrets SDKs provide a secure, zero-knowledge interface for integrating credentials and API calls into your applications and AI agent workflows. 

Following the **No get() Principle**, our SDKs are structurally incapable of retrieving decrypted secret values into your application's process memory. Instead, they provide clean abstraction layers to route operations through the local secure proxy daemon.

---

## Supported Integration Models

You can integrate AgentSecrets into your codebase using two distinct methods depending on your requirements:

### 1. Transparent HTTP Client Interception (Recommended)
This method monkey-patches standard HTTP libraries (such as `requests` and `httpx` in Python) upon initialization. Outgoing requests containing special placeholder tokens (e.g. `AS_SECRET_OPENAI_KEY`) are automatically intercepted, stripped of the placeholder, and routed through the local proxy daemon.

This enables:
* **Zero code modifications** to third-party SDKs (such as `openai` or `stripe` clients).
* **Easy onboarding**: You initialize standard clients with the placeholder token format, and they work out-of-the-box.
* **Security boundary**: Keys never touch the process memory of your AI agent or main application.

### 2. Explicit Client Calls
For custom integrations or if you prefer explicit proxy routing, the SDK provides a unified `client.call()` interface. You pass the target URL, method, body, and the metadata reference names of the credentials to inject (e.g., `bearer="STRIPE_KEY"`). The SDK formats and forwards the request to the proxy.

---

## Language Support

We support the following client libraries:

* **Python SDK**: Fully featured, offering explicit client calls, child process spawning (`spawn`), and transparent HTTP client interception. See the [Python SDK Guide](/docs/sdk/python) and [Python API Reference](/docs/sdk/python-reference).
* **JavaScript/TypeScript SDK**: *Coming Soon* — designed for Node.js, Bun, and Deno environments.

---

## Testing Agent Workflows

To support automated testing and CI/CD pipelines without exposing production keys or requiring a running proxy daemon, the SDKs include mock interfaces (such as `MockAgentSecrets`).

These mock clients:
* Act as drop-in replacements for testing.
* Record target endpoints, HTTP methods, and key references of calls made.
* Are physically incapable of returning or accessing raw credential values, maintaining complete zero-knowledge integrity.
