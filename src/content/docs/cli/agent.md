# agent

## agentsecrets agent register
Registers a new agent identity in the current workspace and issues its first cryptographically signed token.

```bash
agentsecrets agent register <name> [flags]
```

### Example
```bash
agentsecrets agent register "billing-processor" --project "payments" --env "production" --save-token
```

### CLI Flags
| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--project` | `-p` | string | `""` | Scope the agent identity to a specific project name or ID. |
| `--label` | `-l` | string | `""` | A human-readable label/description for the initial token. |
| `--expires` | `-e` | string | `""` | Expiry duration for the token (e.g. `30d`, `90d`, `1y`). |
| `--env` | | string | current environment | Restrict token usage to a specific environment (e.g. `development`, `staging`, `production`). |
| `--save-token` | | boolean | `false` | Automatically save the issued token directly to your OS Keychain without prompting. |
| `--output-json` | | boolean | `false` | Output the registration metadata and token as JSON. |

---

## agentsecrets agent list
Lists all registered agent identities in the current workspace.

```bash
agentsecrets agent list [flags]
```

### Example
```bash
agentsecrets agent list --project "payments"
```

### CLI Flags
| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--project` | `-p` | string | `""` | Filter the agent list to a specific project. |
| `--output-json` | | boolean | `false` | Output the list as JSON. |

---

## agentsecrets agent delete
Deletes an agent identity registration and permanently revokes all tokens associated with it.

```bash
agentsecrets agent delete <name> [flags]
```

### Example
```bash
agentsecrets agent delete "billing-processor" --confirm
```

### CLI Flags
| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--confirm` | | boolean | `false` | Skip the interactive verification prompt. |

---

## agentsecrets agent token issue
Issues a new cryptographic token for an existing registered agent. This is useful for rotates, multi-instance deployments, or environment boundaries.

```bash
agentsecrets agent token issue <name> [flags]
```

### Example
```bash
agentsecrets agent token issue "billing-processor" --label "secondary-node" --expires "90d"
```

### CLI Flags
| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--label` | `-l` | string | `""` | A human-readable label for this specific token. |
| `--expires` | `-e` | string | `""` | Expiry duration for the token (e.g. `30d`, `90d`). |
| `--env` | | string | current environment | Restrict token usage to a specific environment (e.g. `development`, `staging`, `production`). |
| `--save-token` | | boolean | `false` | Automatically save the issued token directly to your OS Keychain without prompting. |
| `--output-json` | | boolean | `false` | Output the token metadata as JSON. |

---

## agentsecrets agent token list
Lists all active cryptographic tokens issued for a specific agent. For security reasons, the actual raw token values are never shown.

```bash
agentsecrets agent token list <name> [flags]
```

### Example
```bash
agentsecrets agent token list "billing-processor"
```

### CLI Flags
| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--output-json` | | boolean | `false` | Output the list as JSON. |

---

## agentsecrets agent token revoke
Revokes a specific token by its public Token ID (`agt_...`), or revokes all tokens for the agent.

```bash
agentsecrets agent token revoke [token_id] [flags]
```

### Example
```bash
# Revoke a single token
agentsecrets agent token revoke agt_ws01hxyz_abc123 --agent "billing-processor"

# Revoke all tokens for an agent
agentsecrets agent token revoke --all --agent "billing-processor" --confirm
```

### CLI Flags
| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--agent` | `-a` | string | `""` | The name of the agent the token belongs to (required). |
| `--all` | | boolean | `false` | Revoke all tokens issued for the specified agent. |
| `--confirm` | | boolean | `false` | Skip the interactive confirmation prompt. |

---

## agentsecrets agent policy get
Retrieves the capability policy for the specified agent, showing whitelisted and blacklisted secret keys.

```bash
agentsecrets agent policy get <name>
```

### Example
```bash
agentsecrets agent policy get "billing-processor"
```

---

## agentsecrets agent policy set
Updates the capability policy for the specified agent to restrict which secrets they can access.

```bash
agentsecrets agent policy set <name> [flags]
```

### Example
```bash
agentsecrets agent policy set "billing-processor" --allow "STRIPE_KEY,DATABASE_URL"
```

### CLI Flags
| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--allow` | | string | `""` | Comma-separated list of secret keys the agent is allowed to access (whitelisting). |
| `--deny` | | string | `""` | Comma-separated list of secret keys the agent is blocked from accessing (blacklisting). |

> [!NOTE]
> Setting agent policies is a sensitive administrative action. The CLI will prompt you for your workspace/project password to authenticate changes locally before sending them to the control plane.
