# Compliance & Certifications

AgentSecrets is designed from the ground up to satisfy the strictest compliance regimes, including SOC 2 Type II, ISO 27001, HIPAA, and GDPR.

By eliminating credential exposure in process memory and generating immutable access logs, AgentSecrets simplifies your compliance audits.

---

## Access Control & Principle of Least Privilege

Traditional setups often grant broad access to `.env` files. AgentSecrets enforces granular, role-based access control (RBAC):
- **Project Isolation**: A compromised AI agent in the `support` project cannot access secrets in the `billing` project.
- **Environment Isolation**: `production` credentials are cryptographically separated from `development` credentials.
- **Domain Allowlists**: The network boundary actively prevents data exfiltration by denying outbound connections to unauthorized domains.

---

## Data Encryption

### Encryption in Transit
All synchronization traffic between the AgentSecrets CLI and the AgentSecrets Cloud API is secured using TLS 1.3.

### Encryption at Rest (Client-Side)
AgentSecrets employs a strict Zero-Knowledge architecture:
:::step
1. Your workspace encryption key never leaves your local OS Keychain.
2. Credentials are encrypted locally using AES-256-GCM.
3. The AgentSecrets server only receives, stores, and synchronizes the resulting ciphertext blobs.
:::
This structural guarantee means that in the event of an AgentSecrets database breach, your credentials remain mathematically secure.

---

## Audit Logging

For SOC 2 and ISO 27001 compliance, you must prove who accessed what data and when.

AgentSecrets provides transport-layer audit logs for every API call made by an agent. The logs include the agent identity, target domain, timestamp, and key reference, fulfilling non-repudiation requirements without exposing the credential value in the log stream.
