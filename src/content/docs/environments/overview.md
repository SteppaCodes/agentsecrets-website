# agentsecrets environment: Switch and manage envs

Switch between `development`, `staging`, and `production` with one command. All secrets commands respect the active environment automatically.

Every AgentSecrets project comes with three built-in environments: `development`, `staging`, and `production`. These are first-class concepts, not labels you define yourself. One command changes the active context, and the proxy, `push`, `pull`, and `diff` commands all respect that context automatically, no flags required.



