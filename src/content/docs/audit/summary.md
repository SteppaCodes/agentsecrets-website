# Audit Log Summary

AgentSecrets provides an immutable, cryptographically verifiable audit trail for every credential accessed through the platform.

Unlike traditional secrets managers that log *when* a credential was downloaded, AgentSecrets logs the actual API invocation at the transport boundary, providing significantly deeper visibility into agent behavior without compromising the zero-knowledge security model.

---

## The Zero-Knowledge Guarantee

The most important feature of the AgentSecrets audit log is structural: **it is incapable of recording a credential value.**

Because the proxy only resolves the value from the local OS Keychain in memory and injects it directly into the outbound TLS socket, there is no application code path that writes the value to standard output, disk, or the logging buffer.

Your audit logs will show you that `STRIPE_KEY` was used by the `billing-agent` to contact `api.stripe.com/v1/charges` at `14:23:01`, but the value `sk_live_...` is completely absent from the event schema.

---

## Local-First Architecture

Audit logs in AgentSecrets are **local-first**.

When the local credential proxy intercepts a request, it writes the audit record directly to your machine (or your agent's container disk) before asynchronously synchronizing it to the AgentSecrets cloud dashboard.

This architecture ensures that even if your agent container loses internet connectivity to the AgentSecrets API, your API calls will still succeed (because decryption happens entirely locally via the OS Keychain), and the audit logs will safely buffer on disk until connectivity is restored.
