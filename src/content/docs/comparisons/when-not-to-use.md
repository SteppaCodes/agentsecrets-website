# When NOT to use AgentSecrets

AgentSecrets is explicitly designed to solve the credential exposure problem for **AI Agents** and LLM-assisted tools. It optimizes for zero-knowledge transport and developer experience.

However, it is not a silver bullet for every infrastructure problem.

## Do NOT use AgentSecrets if:

### 1. You are managing Infrastructure as Code (IaC) Secrets
If you need to securely inject database passwords into Terraform states or Kubernetes ConfigMaps at provisioning time, use HashiCorp Vault or AWS Secrets Manager. AgentSecrets is a runtime transport proxy, not a provisioning tool.

### 2. You need dynamic, time-bound credentials
If your architecture requires generating temporary database credentials that expire after 10 minutes, AgentSecrets does not currently support dynamic secret generation. You should use Vault's dynamic secrets engine.

### 3. Your application is entirely client-side (Browser/Mobile)
AgentSecrets runs as a local proxy or a sidecar container. It cannot be deployed directly into a user's web browser or mobile application. If you are distributing client-side code, you still must route API calls through your own backend.

### 4. You do not have outbound HTTP/HTTPS access
The proxy requires network access to route the requests to external APIs (like Stripe, OpenAI, GitHub). If your environment is strictly air-gapped without API access, AgentSecrets cannot route traffic.

## Summary

Use AgentSecrets to protect AI Agents from prompt-injected credential theft. For traditional infrastructure provisioning or dynamic secret generation, stick to enterprise tools like Vault.
