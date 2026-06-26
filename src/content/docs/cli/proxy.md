# proxy

## agentsecrets proxy start
```bash
agentsecrets proxy start
agentsecrets proxy start --port 9000
```
Starts the local proxy. Default port is 8765.

## agentsecrets proxy stop
```bash
agentsecrets proxy stop
```
Stops the proxy.

## agentsecrets proxy status
```bash
agentsecrets proxy status
```
Shows whether the proxy is running, which port, and the current revocation list sync status.

## agentsecrets proxy logs
```bash
agentsecrets proxy logs
agentsecrets proxy logs --last 20
agentsecrets proxy logs --watch
agentsecrets proxy logs --secret KEY_NAME
agentsecrets proxy logs --env production
```
Views or streams the local proxy audit log. Filters by key name or environment.

## agentsecrets proxy approve
```bash
agentsecrets proxy approve <KEY> <METHOD> <DOMAIN>
```
Grants a session-based approval for a restricted secret. When a secret's policy has a `request_permission` action, the proxy pauses the request until this command is executed (or approved interactively in the proxy terminal). The approval lasts until the proxy is restarted.

## agentsecrets proxy rotate-session
```bash
agentsecrets proxy rotate-session
```
Generates a new proxy session token, updates the secure local session storage, and notifies the running proxy daemon to immediately adopt the new token.

