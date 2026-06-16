# env

## agentsecrets env -- <command>
```bash
agentsecrets env -- <command> [args...]
```

Injects all secrets configured for the active project environment into a child process at spawn time. 

### Mandatory Output Masking (Stdout/Stderr Redaction)
Although our zero-knowledge architecture keeps secret values out of sight, the `env` command can be a potential weak link. Since dynamic applications and SDKs require secrets in their environment variables, an attacker or a compromised AI agent could execute a script to print the entire environment block, exposing the raw credentials. 

To mitigate this threat, `agentsecrets` enforces mandatory output masking:
1. **Real-time Redaction**: The parent `agentsecrets` process intercepts the child's `stdout` and `stderr` streams, scanning them in real-time.
2. **Pre-computed Variant Protection**: The scanner matches not only the raw secret values but also their common encodings and case transformations to prevent simple obfuscation bypasses:
   * Case-insensitive matches (Uppercase & Lowercase)
   * Base64 (Standard & URL-safe encodings)
   * Hex-encoded representations
   * URL-query escaped values
3. **Always Enforced**: This security layer is always active. There are no bypass flags (like `--no-mask`) to ensure AI agents or malicious scripts cannot turn off the masking.

*Note: The actual secret values are still loaded into the child process environment memory, meaning dynamic operations like network API calls proceed normally.*

