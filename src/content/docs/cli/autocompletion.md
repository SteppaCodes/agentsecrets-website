---
title: "Shell Autocompletion"
description: "Set up shell autocompletion for the AgentSecrets CLI in Bash, Zsh, Fish, and PowerShell."
---

# Shell Autocompletion

The AgentSecrets CLI includes built-in autocompletion support for Bash, Zsh, Fish, and PowerShell. Setting up completions makes command execution faster and reduces spelling errors.

---

## 1. Zsh

To configure completions for Zsh, run the following commands to generate the completion script and load it automatically on startup:

:::step
### Create the completions directory if it doesn't exist:
```bash
mkdir -p ~/.agentsecrets/completions/zsh
```
:::

:::step
### Generate the completion script:
```bash
agentsecrets completion zsh > ~/.agentsecrets/completions/zsh/_agentsecrets
```
:::

:::step
### Add the completions path and load the function in your `~/.zshrc`:
Open your `~/.zshrc` file and add the following lines before `compinit`:
```bash
fpath=(~/.agentsecrets/completions/zsh $fpath)
autoload -U compinit; compinit
```
:::

:::step
### Reload your shell:
```bash
source ~/.zshrc
```
:::

---

## 2. Bash

To load completions in Bash, ensure the `bash-completion` package is installed, then configure your shell:

:::step
### Generate and load completions in the current session:
```bash
source <(agentsecrets completion bash)
```
:::

:::step
### Load completions automatically on new sessions:
- **On Linux**:
  ```bash
  agentsecrets completion bash > /etc/bash_completion.d/agentsecrets
  ```
- **On macOS (using Homebrew)**:
  ```bash
  agentsecrets completion bash > $(brew --prefix)/etc/bash_completion.d/agentsecrets
  ```
:::

---

## 3. Fish

Completions for Fish are stored in user configuration paths and load automatically:

:::step
### Generate the completion script:
```bash
agentsecrets completion fish > ~/.config/fish/completions/agentsecrets.fish
```
:::

---

## 4. PowerShell

To configure completions for PowerShell:

:::step
### Generate and import the completion script in your profile:
```powershell
agentsecrets completion powershell | Out-String | Invoke-Expression
```
Add the above line to your PowerShell profile (check `$PROFILE` path) to load completions automatically on start.
:::
