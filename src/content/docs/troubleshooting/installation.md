# Installation Issues

If you encounter issues while installing the AgentSecrets CLI, refer to the solutions below based on your package manager.

## Homebrew (macOS / Linux)

**Error:** `Error: The-17/tap/agentsecrets is not a valid tap`
**Solution:** Ensure you typed the tap name correctly. Run:
```bash
brew update
brew install The-17/tap/agentsecrets
```

**Error:** `Command not found: agentsecrets`
**Solution:** Homebrew might not be in your system's PATH. Add `/opt/homebrew/bin` (Apple Silicon) or `/usr/local/bin` (Intel) to your `~/.zshrc` or `~/.bashrc`.

## NPM

**Error:** `EACCES: permission denied`
**Solution:** Do not use `sudo npm install -g`. Instead, configure npm to use a directory you own:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g @the-17/agentsecrets
```

## Pip

**Error:** `externally-managed-environment`
**Solution:** Modern Python environments prevent global pip installs to avoid breaking OS packages. Use `pipx` instead:
```bash
pipx install agentsecrets-cli
```
