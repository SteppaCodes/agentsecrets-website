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

## Showcase: Automatic Output Masking

To see output masking in action, suppose you have a secret named `TEST_SECRET_MASK` with the value `SuperSecretKey123` configured in your active development environment.

If you run a command that prints this secret directly, or in any of its common encoded formats, `agentsecrets` automatically intercepts the output and replaces it with `[REDACTED]`.

### 1. Direct Output Masking
```bash
$ agentsecrets env -- sh -c 'echo $TEST_SECRET_MASK'
[REDACTED]
```

### 2. Base64 Encoded Masking
AI agents or rogue scripts might attempt to bypass simple checks by base64-encoding the environment variables. `agentsecrets env` pre-computes the Base64 representation of your secret values and masks them:
```bash
$ agentsecrets env -- sh -c 'echo $TEST_SECRET_MASK | base64'
[REDACTED]
```

### 3. Hex Encoded Masking
Hexadecimal encodings (including common `0x` prefixes) are also caught and masked automatically:
```bash
$ agentsecrets env -- sh -c 'echo -n $TEST_SECRET_MASK | xxd -p'
[REDACTED]
```

### 4. Case Variation Masking
If the key name itself is accessed with a different case (such as `$test_secret_mask` instead of `$TEST_SECRET_MASK` on case-insensitive platforms or configurations), the value is still resolved and masked:
```bash
$ agentsecrets env -- sh -c 'echo $test_secret_mask'
[REDACTED]
```


