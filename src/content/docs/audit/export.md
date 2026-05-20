# Exporting Audit Logs

For enterprise environments and strict compliance mandates, you can configure AgentSecrets to continuously export your audit logs to external Security Information and Event Management (SIEM) providers.

---

## Supported Providers

AgentSecrets natively supports log streaming to:
- Datadog
- Splunk
- AWS CloudWatch
- Google Cloud Logging
- Generic Webhook (JSON POST)

---

## Configuring an Export Sink

To configure a log export sink, use the CLI or the AgentSecrets Cloud Dashboard.

```bash
agentsecrets audit export setup --provider datadog
```

The interactive setup will prompt you for your Datadog API Key and region. 

Once configured, the AgentSecrets synchronization server will automatically forward all buffered proxy access logs to the specified provider in near real-time.

> [NOTE]
> Because AgentSecrets operates on a zero-knowledge architecture, the credential values are structurally absent from the audit log schema. You can safely stream these logs to external observability platforms without risking credential leakage into your monitoring stack.

---

## Export Format

Logs are exported in standard JSON format. See the [Audit Detail Schema](detail.md) for the exact payload structure you should expect in your SIEM dashboards.
