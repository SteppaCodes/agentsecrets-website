# AgentSecrets vs dotenv-vault / dotenvx

`dotenv-vault` (and its successor `dotenvx`, by the same author) encrypts `.env` files so they can be safely committed to git. `dotenvx` replaced `dotenv-vault` entirely in 2025 — the vault Pro tier shut down in February 2026.

## What dotenvx Does Well

dotenvx is a genuine improvement over plaintext `.env` files. It encrypts individual values inline using ECIES with AES-256, so an AI agent scanning your project directory sees `KEY=encrypted:BASE64...` instead of your Stripe key. It also markets itself as "Ready for Agents", which is fair — encrypted files prevent casual leakage to coding assistants.

## The Runtime Gap

Encryption at rest solves half the problem. At runtime, dotenvx still needs to decrypt:

```bash
dotenvx run -- npm start
```

This decrypts every value into the process environment block (`process.env`, `os.environ`). Once loaded, any code running in that process — including AI agents, third-party dependencies, or compromised plugins — can read every secret by inspecting environment variables.

If a LangChain agent running under `dotenvx run --` is prompted to `import os; print(os.environ)`, the decrypted credentials are right there in memory.

## Where AgentSecrets Differs

| Concern | dotenvx / dotenv-vault | AgentSecrets |
|---|---|---|
| **Encryption at rest** | ECIES inline in `.env` file | AES-256-GCM in OS keychain |
| **Delivery to process** | Decrypts into `os.environ` (plaintext in memory) | Transport-layer injection via proxy (never enters agent context) |
| **AI agent visibility** | Encrypted on disk, plaintext in memory | Never plaintext — not on disk, not in memory |
| **Per-secret constraints** | None | Domain + method restrictions (`secrets policy set`) |
| **Agent identity** | None | Cryptographic tokens (`agent register`) |
| **Process verification** | None | `keychain-auth` daemon (binary hash check) |
| **Team sync** | Paid Armor product ($36/yr+) | Built-in E2E encrypted sync |

## The Core Difference

dotenvx moves secrets from plaintext on disk to encrypted on disk — then decrypts them into memory at runtime. AgentSecrets moves secrets out of disk and out of memory entirely, keeping them in the OS keychain and injecting them at the transport layer. For traditional apps this distinction may not matter. For AI agents that dynamically execute untrusted instructions, it is the difference between exposed and not exposed.

## Using Them Together

You can use dotenvx for non-sensitive configuration (feature flags, public URLs) alongside AgentSecrets for actual credentials. There is no conflict — AgentSecrets only needs the proxy port or the `env` subcommand, both of which coexist with any `.env` loading strategy.
