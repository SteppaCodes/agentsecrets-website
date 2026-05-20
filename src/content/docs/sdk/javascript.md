# JavaScript / TypeScript SDK

The AgentSecrets JavaScript/TypeScript SDK provides a fully-typed, asynchronous client interface for making zero-knowledge calls from Node.js, Bun, or Deno environments. 

Following the Zero-Knowledge paradigm, the SDK client does not expose a `get()` method. There is no way to retrieve a raw credential value into your application's execution scope; all operations keep the values securely within the proxy boundary.

---

## Installation

Install the package using your preferred package manager:

:::tabs

## npm
```bash
npm install @the-17/agentsecrets
```

## yarn
```bash
yarn add @the-17/agentsecrets
```

## pnpm
```bash
pnpm add @the-17/agentsecrets
```

## Bun
```bash
bun add @the-17/agentsecrets
```

:::

> [NOTE]
> The SDK requires the local CLI installed and the proxy daemon running on the host machine. If the proxy is not active, the SDK will attempt to auto-start it by default.

---

## Initializing the client

Import and instantiate the `AgentSecrets` class. The client is fully typed and supports ES Modules (ESM) and CommonJS (CJS).

```typescript
import { AgentSecrets } from '@the-17/agentsecrets';

// Default configuration — loads active workspace, project, and environment from local settings
const client = new AgentSecrets();

// Explicit configuration
const client = new AgentSecrets({
  workspace: "Acme Engineering",
  project: "payments-service",
  environment: "production",
  port: 8765,           // Custom proxy port
  autoStart: true,      // Automatically start proxy daemon if not running
  agentId: "billing-processor", // Declared agent identity
  agentToken: "agt_ws01hxyz_4kR9mNpQ..." // Cryptographic token for headless servers
});
```

---

## Making calls — client.call()

The core method of the SDK is `client.call()`, which routes requests through the local proxy. It accepts the target URL and an injection directive referencing the key name.

### Bearer token
```typescript
const response = await client.call({
  url: "https://api.stripe.com/v1/balance",
  bearer: "STRIPE_KEY"
});
```

### POST with body
```typescript
const response = await client.call({
  url: "https://api.stripe.com/v1/charges",
  method: "POST",
  bearer: "STRIPE_KEY",
  body: {
    amount: 1000,
    currency: "usd",
    source: "tok_visa"
  }
});
```

### Custom header
```typescript
const response = await client.call({
  url: "https://api.sendgrid.com/v3/mail/send",
  method: "POST",
  header: { "X-Api-Key": "SENDGRID_KEY" },
  body: payload
});
```

### Query parameter
```typescript
const response = await client.call({
  url: "https://maps.googleapis.com/maps/api/geocode/json",
  params: { address: "Lagos, Nigeria" },
  query: { key: "GOOGLE_MAPS_KEY" }
});
```

### Basic auth
```typescript
const response = await client.call({
  url: "https://jira.example.com/rest/api/2/issue/PROJ-1",
  basic: "JIRA_CREDS" // Credentials must be stored in OS keychain as "username:password"
});
```

### Multiple credentials in one call
```typescript
const response = await client.call({
  url: "https://api.example.com/data",
  bearer: "AUTH_TOKEN",
  header: { "X-Org-ID": "ORG_SECRET" }
});
```

---

## call() full signature

```typescript
const response = await client.call({
  url: string;                  // Required — target HTTPS URL
  method?: string;              // HTTP verb (default: 'GET')
  bearer?: string;              // Key name to inject as a bearer token
  basic?: string;               // Key name to inject as basic auth (username:password)
  header?: Record<string, string>; // Header mappings { [headerName]: keyName }
  query?: Record<string, string>;  // Query param mappings { [paramName]: keyName }
  bodyField?: Record<string, string>; // Deep JSON path mappings { [jsonPath]: keyName }
  formField?: Record<string, string>; // Form field mappings { [fieldName]: keyName }
  body?: any;                   // Non-credential request body (object or string)
  params?: Record<string, any>; // Non-credential query parameters
  headers?: Record<string, any>;// Non-credential request headers
  timeout?: number;             // Request timeout in milliseconds (default: 30000)
});
```

---

## Response object

The resolved promise returns a structured response object. Because of the Zero-Knowledge paradigm, this object is structurally incapable of carrying the plaintext credential.

| Property | Type | Description |
| :--- | :--- | :--- |
| `response.statusCode` | `number` | HTTP status code returned by the target API. |
| `response.body` | `string` | Raw, unparsed response body. |
| `response.headers` | `Record<string, string>` | Response headers returned by the target API. |
| `response.redacted` | `boolean` | `true` if the proxy redacted a credential echo in the response. |
| `response.durationMs` | `number` | Total request round-trip duration in milliseconds. |

### Helper method
```typescript
const data = response.json(); // Parses response.body as JSON and returns it as an object
```

---

## Spawning processes — client.spawn()

You can run external binaries, scripts, or build tasks with credentials injected directly into the spawn environment. The calling JavaScript process never sees the values.

```typescript
// Spawns Stripe CLI in MCP mode with credentials injected
const result = await client.spawn("stripe", ["mcp"]);

// Spawn a Node server injecting keychain environment variables
const child = await client.spawn("node", ["server.js"], {
  env: { PORT: "3000" } // Merge additional non-credential environment variables
});
```

---

## Management surface

The SDK exposes programmatic access to the CLI management commands for automation workflows:

```typescript
// Secrets (Names and status only, never plaintext values)
const list = await client.secrets.list(); // Returns an array of keys
const exists = await client.secrets.check(["STRIPE_KEY", "OPENAI_KEY"]); // Returns { STRIPE_KEY: boolean, OPENAI_KEY: boolean }
await client.secrets.pull(); // Programmatically pull down encrypted secrets
await client.secrets.push(); // Programmatically push local environment configurations
const diff = await client.secrets.diff(); // Returns comparison metadata between local and remote stores

// Environments
await client.environments.switch("production");
const envs = await client.environments.list(); // Returns available environments

// Status
const status = await client.status();
console.log(status.workspace);     // string
console.log(status.project);       // string
console.log(status.environment);   // string
console.log(status.proxyRunning);  // boolean
console.log(status.proxyPort);     // number
```

---

## MockAgentSecrets for testing

For testing environments (e.g., Jest, Vitest, or Mocha), you can replace the real client with a mock implementation that doesn't require a running proxy daemon or actual keychain access.

```typescript
import { MockAgentSecrets } from '@the-17/agentsecrets';

const mock = new MockAgentSecrets({
  responses: {
    "https://api.stripe.com/v1/balance": {
      object: "balance",
      available: [{ amount: 420000, currency: "usd" }]
    }
  },
  statusCode: 200,
  environment: "development"
});

// Use it as a drop-in replacement in your codebase
const response = await mock.call({
  url: "https://api.stripe.com/v1/balance",
  bearer: "STRIPE_KEY"
});

const data = response.json();
console.log(data.available[0].amount); // 420000

// Assertions on calls
console.log(mock.calls.length); // 1
console.log(mock.calls[0].keyName); // "STRIPE_KEY"
console.log(mock.calls[0].url); // "https://api.stripe.com/v1/balance"
console.log(mock.calls[0].method); // "GET"

// Note: mock.calls[0] does not contain any credential values
```

---

## Error handling

The SDK throws specific, typed error classes depending on the failure mode:

```typescript
import { 
  AgentSecretsError, 
  ProxyNotRunningError, 
  KeyNotFoundError,
  DomainNotAllowedError 
} from '@the-17/agentsecrets';

try {
  const response = await client.call({
    url: "https://api.stripe.com/v1/balance",
    bearer: "STRIPE_KEY"
  });
} catch (error) {
  if (error instanceof ProxyNotRunningError) {
    console.error("The local daemon is not running.");
  } else if (error instanceof KeyNotFoundError) {
    console.error("The key 'STRIPE_KEY' does not exist in the active environment.");
  } else if (error instanceof DomainNotAllowedError) {
    console.error("The domain 'api.stripe.com' is not allowlisted.");
  } else if (error instanceof AgentSecretsError) {
    console.error(`Generic SDK Error: ${error.message}`);
  }
}
```
