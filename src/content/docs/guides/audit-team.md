# Auditing Team Activity

AgentSecrets provides immutable, cryptographic audit logs for every API call routed through the local proxy. 

## How Auditing Works

Whenever a developer or an AI agent uses the proxy to inject a credential, the proxy signs a lightweight metadata payload and syncs it to the cloud asynchronously. 

The audit log captures:
- The `KEY_NAME` used (e.g., `OPENAI_API_KEY`)
- The target domain (e.g., `api.openai.com`)
- The Agent Identity (if declared, otherwise it logs the developer's CLI session ID)
- The timestamp and environment

**The audit log never captures the credential value, request body, or response body.**

## Viewing Logs

You can view the logs from the CLI:

```bash
agentsecrets audit
```

This will stream the latest events. To filter by a specific environment:

```bash
agentsecrets audit --env production
```

## Integrating with SIEMs

For compliance and security monitoring, you can ingest AgentSecrets audit logs into SIEM providers (like Datadog, Splunk, or Elastic) by exporting them locally via the CLI or downloading them programmatically via the Cloud Server API.
