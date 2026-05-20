# Using AgentSecrets in a Monorepo

AgentSecrets handles Monorepos (e.g., Turborepo, Nx, Lerna) seamlessly by allowing you to define distinct Projects within a single Workspace.

## Project Structure

If you have a frontend Next.js app and a backend Python API, you should create two separate projects.

```bash
agentsecrets project create frontend
agentsecrets project create backend
```

## Running the Proxy

You only need to run one instance of the proxy per machine. The proxy listens on port `8765`. 

When your frontend or backend processes make requests through the proxy, the proxy automatically knows which project context to use based on the local `.agentsecrets` directory or the `AGENTSECRETS_PROJECT_ID` environment variable you provide to the process.

## Environment Variables

For Monorepos that still rely on `.env` files for non-sensitive configuration (like `PORT=3000`), you can use the AgentSecrets injection command to seamlessly merge the cloud secrets with your local files:

```bash
agentsecrets run -- npm run dev
```
