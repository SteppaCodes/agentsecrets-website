# Deploying from Dev to Production

Moving an AgentSecrets-powered application from development to production requires switching from a local developer environment to a headless server environment.

## 1. Ensure Production Secrets Exist
:::step

First, ensure your `production` environment is fully populated with secrets:

```bash
agentsecrets environment switch production
agentsecrets secrets list
```
:::

## 2. Generate a Service Token
:::step

Your server cannot run `agentsecrets login` to authenticate interactively. Instead, you need a Service Token.

Generate one in the web dashboard or via CLI:
```bash
agentsecrets account generate-token --role server
```
:::

## 3. Configure the Server
:::step

On your production server (e.g., AWS EC2, DigitalOcean Droplet, Kubernetes pod), set the `AGENTSECRETS_TOKEN` environment variable.

```bash
export AGENTSECRETS_TOKEN="ast_live_12345..."
export AGENTSECRETS_ENV="production"
```
:::

## 4. Run the Proxy Sidecar
:::step

In production, the proxy typically runs as a sidecar container or a background daemon.

```bash
agentsecrets proxy start
```

Because the `AGENTSECRETS_TOKEN` is present, the proxy will authenticate, pull the `production` secrets down from the cloud, hold them in encrypted memory, and begin routing traffic immediately.

Your application code does not need to change! It continues making requests to `localhost:8765` using the key names.
:::
