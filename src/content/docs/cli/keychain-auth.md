---
title: "keychain-auth Subsystem"
description: "How the keychain-auth daemon secures the operating system keychain against process impersonation and rogue scripts."
---

# keychain-auth Subsystem

The `keychain-auth` daemon is the capability-bounding security subsystem of AgentSecrets. Rather than just acting as a bridge to the operating system's native keychain (such as macOS Keychain, Windows Credential Manager, or Linux Secret Service), it enforces strict **Process Identity Verification** and **Anti-Impersonation**.

---

## The Security Problem it Solves

In standard secrets managers, keychain access is wide open to any process running under your user session. If a user is logged in, any random shell script, third-party dependency, or rogue tool can invoke the secrets CLI or query the keychain directly to retrieve raw values.

AgentSecrets blocks this vector structurally via `keychain-auth`:
- **Cryptographic Binary Validation**: Before resolving any credential from the OS keychain, the `keychain-auth` daemon validates the cryptographic hash and executable path of the calling CLI binary.
- **Rogue Script Prevention**: If a malicious script attempts to call `agentsecrets secrets list` or impersonate the CLI, the daemon detects the hash mismatch and denies the request immediately.
- **Isolated Process Space**: All cryptographic decryption operations are isolated inside the daemon's RAM, completely hidden from other running processes.

---

## How It Works & Client Integration

Every credential request is guarded by a multi-stage validation handshake:

1. **Connection & Handshake Probe**: The client (e.g. `agentsecrets` Go CLI) initiates a connection to the daemon over IPC. Since the daemon performs binary path and hash verification on the connecting PID immediately, the client sets a short read deadline (`connectionProbeTimeout`) and attempts to read a denial response. If the daemon closes or rejects the connection with a `RESPONSE` status of `"denied"`, the handshake fails. If the probe times out without denial, the client clears the deadline and assumes the connection is accepted.
2. **Protocol Sanity Check (PING)**: Before performing any business actions, the client validates that the daemon speaks the v2.0+ JSON protocol by sending a ping:
   ```json
   {
     "type": "REQUEST",
     "action": "search",
     "service": "AgentSecrets"
   }
   ```
   If the daemon returns a valid `RESPONSE` structure, the handshake is complete and the connection is bound as the authenticated session (no tokens required).
3. **Process Hash Attestation**: The connection is routed to `keychain-auth` via:
   - **macOS / Linux**: A secure local Unix domain socket (`agent.sock`).
   - **Windows**: A secure Local Named Pipe (`\\.\pipe\keychain-auth`).
4. **Identity Verification**: The daemon checks the caller's process ID (PID) at connection time:
   - On macOS and Linux, it uses socket peer credentials (`SO_PEERCRED` / `getpeereid`).
   - On Windows, it uses `GetNamedPipeClientProcessId` and `QueryFullProcessImageName` over the named pipe connection.
   It then traces the PID back to the execution binary on disk and verifies its cryptographic hash (SHA-256) and path against authorized records.
5. **Key Decryption**: Only if the binary identity is validated does the daemon fetch the encrypted Workspace Key, decrypt the requested secret locally, and inject it temporarily at the transport boundary.

---

## Protocol Specification & JSON payloads

Clients communicate with the daemon using a line-delimited JSON protocol optimized for batch and atomic operations.

### 1. Request Structure
Requests are sent as a single line JSON object:
```json
{
  "type": "REQUEST",
  "action": "read | write | delete | search | check",
  "service": "AgentSecrets",
  "match": "exact | prefix",
  "targets": ["ws_01H:proj_01:production:STRIPE_KEY"],
  "values": ["optional-value-for-write-1"],
  "attributes": {
    "environment": "production"
  }
}
```
*   `match`: Can be `exact` (default) or `prefix`. `"match": "prefix"` is supported for `read`, `delete`, and `search` actions.

### 2. Response Structure
The daemon processes the batch atomically and replies:
```json
{
  "type": "RESPONSE",
  "status": "success | denied | error",
  "reason": "unregistered_binary | action_not_in_policy | service_not_allowed | malformed_request",
  "results": [
    {
      "target": "ws_01H:proj_01:production:STRIPE_KEY",
      "value": "decrypted-plaintext-value",
      "attributes": {
        "environment": "production"
      }
    }
  ]
}
```

---

## Secure Transport & IPC Design

### Windows Named Pipes
While modern Windows versions support Unix Domain Sockets (`AF_UNIX`), they lack standard POSIX capabilities like `SO_PEERCRED` to query the connecting client's process credentials. To prevent process impersonation, AgentSecrets utilizes **Windows Named Pipes** for communication.
By calling `GetNamedPipeClientProcessId`, `keychain-auth` verifies the exact PID of the connecting CLI or proxy client, resolves its executable path, and computes its SHA-256 hash. Any connection from unauthorized paths or modified binaries is rejected immediately.

### WSL Host Interop & TPM2 Sealing Fallbacks
In headless or virtualized environments where standard desktop keyrings (GNOME Keyring/KWallet/D-Bus) are unavailable, `keychain-auth` implements secure fallback mechanisms:
* **WSL (Windows Host Interop)**: Instead of storing master credentials on the Linux filesystem, `keychain-auth` delegates the master key storage to the Windows Host's native **Windows Credential Manager** via execution interop. At runtime, the daemon executes a lightweight Windows helper (`keychain-helper.exe`) which it automatically extracts to the host user's profile folder (`C:\Users\<user>\.config\keychain-auth\keychain-helper.exe`). The master key is loaded dynamically into daemon memory, leaving zero footprints on the Linux VM disk.
* **Headless Linux (TPM2 Key Sealing)**: If a hardware or virtual TPM 2.0 module is present (`/dev/tpm0`), the master key is sealed directly to the hardware TPM chip platform configuration registers, preventing physical database extraction attacks.
* **POSIX Fallback**: If neither TPM2 nor WSL is available, the daemon falls back to writing the encrypted database locally inside the platform-appropriate config folder with strict `0600` permissions.

---

## Supported Keychain Backends

AgentSecrets leverages native OS cryptographic storage APIs:
- **macOS**: Apple Keychain Service.
- **Windows**: Windows Credential Manager & Data Protection API (DPAPI).
- **Linux / WSL**: Secret Service API (GNOME Keyring / KWallet) with an **in-memory fallback** if a graphical keyring/dbus session is absent.

### Configuration & Logs Locations

The daemon configures binary registrations and stores log traces in OS-standard locations:

- **Windows**:
  - Config: `%APPDATA%\keychain-auth\config.json`
  - Logs: `%LOCALAPPDATA%\keychain-auth\daemon.log`
- **macOS**:
  - Config: `~/Library/Application Support/keychain-auth/config.json`
  - Logs: `~/Library/Application Support/keychain-auth/daemon.log`
- **Linux / WSL**:
  - Config: `~/.config/keychain-auth/config.json` (respects `$XDG_CONFIG_HOME`)
  - Logs: `~/.config/keychain-auth/daemon.log`

---

## Troubleshooting

If you experience connection errors or handshake failures with the `keychain-auth` daemon:

1. **Verify Daemon Status**: Check if the background service is running:
   ```bash
   agentsecrets proxy status
   ```
2. **Restart the Subsystem**: If the daemon hangs or configuration permissions change, restart it to re-initialize socket connections:
   ```bash
   agentsecrets proxy stop
   agentsecrets proxy start
   ```
3. **Verify AppData Permissions**: On Windows, ensure the directory `%APPDATA%\keychain-auth` is writable by your user account.
4. **Daemon Log Auditing**: Check the daemon logs for detailed rejection reasons (e.g., process hash mismatches during registration or upgrades).
