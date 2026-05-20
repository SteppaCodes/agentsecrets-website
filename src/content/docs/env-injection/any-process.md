# Running Any Process

The `agentsecrets env` command allows you to run any script, application, or tool with secrets injected directly from your secure local OS Keychain. It acts as a lightweight parent process wrapper, completely eliminating the need for plaintext `.env` configuration files on your system.

---

## Process Spawn Mechanics

When you execute a command using `agentsecrets env -- <command>`, AgentSecrets performs a secure, multi-stage spawn operation:

:::step
1. **Target Context Verification**: The CLI reads the active workspace, project, and environment config in the execution directory.
2. **Local Keychain Read**: It queries the OS Keychain (macOS Keychain, Windows Credential Manager, or Linux Secret Service) for the secrets belonging to the active environment namespace.
3. **Decryption**: It decrypts the stored values locally.
4. **Child Process Spawning**: The CLI spawns the target command as a child process, passing the decrypted secrets directly into the environment variable array of the child process.
5. **Memory Clean**: The parent CLI process immediately overwrites the plaintext secrets in its own RAM and exits, leaving the child process running with the injected variables in its process memory.
:::

Because the values are passed directly to the OS spawn call, they are **ephemeral**:
- They are never written to any file on disk.
- They are not accessible to other users or unrelated processes on the machine.
- They disappear completely from system RAM the moment the child process exits.

---

## Language & Runtime Examples

Because environment injection happens at the operating system level, it is completely language-agnostic. 

### Python
Run django, flask, fastapi, or custom scripts:
```bash
agentsecrets env -- python main.py
```
Inside your script:
```python
import os
# Accessible as standard environment variables
openai_key = os.environ.get("OPENAI_KEY")
```

### Node.js / TypeScript
Run Next.js, Express, Vite, or NestJS servers:
```bash
agentsecrets env -- npm run dev
```
Inside your JavaScript code:
```javascript
// No dotenv packages required
const stripeKey = process.env.STRIPE_KEY;
```

### Go
Run compiled Go binaries:
```bash
agentsecrets env -- ./my-server
```
Inside Go:
```go
package main
import (
    "fmt"
    "os"
)
func main() {
    stripeKey := os.Getenv("STRIPE_KEY")
}
```

### Docker Compose
You can pass credentials into container runtimes without exposing them in your Compose files:
```bash
agentsecrets env -- docker compose up
```
In your `docker-compose.yml`:
```yaml
services:
  web:
    image: my-app:latest
    environment:
      - STRIPE_KEY # Docker inherits this from the host shell environment
```

---

## Security Guarantees and Constraints

While environment injection provides perfect compatibility with all existing applications, it has a weaker security boundary than the transport-layer proxy:

> [IMPORTANT]
> **Memory Inspection Risk:**
> Secrets injected into environment variables reside in the target process RAM. If you are building an AI agent that is given direct tool access to run system commands (like `env`, `printenv`, or arbitrary shell scripts), the agent can extract and expose these keys. 
> 
> For autonomous AI agents, always use the **Credential Proxy** or **Zero-Knowledge SDK** instead of environment injection.
