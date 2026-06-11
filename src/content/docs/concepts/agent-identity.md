---
title: "Agent Identity"
description: "Why AI agents need identity, how AgentSecrets provides three levels of attribution, and what this means for security in multi-agent systems."
---

# Agent Identity

In traditional software, credentials are loaded at startup by a single trusted process. The process is the identity — if the server has the API key, it's authorized. This model worked because applications were deterministic: they executed pre-written code paths, not arbitrary instructions.

AI agents break this assumption. An agent interprets natural language, processes untrusted inputs, and dynamically decides which APIs to call. When three agents share the same Stripe key and one makes a suspicious charge, there's no way to know which agent did it. When a prompt injection tricks an agent into exfiltrating data, there's no way to isolate the compromised agent without shutting everything down.

Agent Identity solves this by making every credential access traceable to the specific agent that requested it.

---

## The Problem with Flat Credential Pools

Most secrets managers treat the runtime environment as a single identity. Every process, every agent, every tool in that environment gets the same level of access.

```
Traditional Model:
┌─────────────────────────────────────────┐
│              Runtime Environment         │
│                                         │
│  Agent A ──┐                            │
│  Agent B ──┼── All share STRIPE_KEY ──► │  Single pool
│  Agent C ──┘                            │
│                                         │
│  ❌ Who made the $50k charge?            │
│  ❌ Which agent was prompt-injected?     │
│  ❌ Can I revoke just Agent C?           │
└─────────────────────────────────────────┘
```

This creates three structural failures:

1. **No attribution**: Audit logs show _that_ a credential was used, but not _who_ used it. When a billing spike occurs at 3am, you're left guessing.
2. **No isolation**: A compromised agent has access to every credential in the pool. Prompt injection against one agent is a breach of the entire system.
3. **No surgical revocation**: To cut off a misbehaving agent, you must rotate the credential itself, immediately breaking every other agent that depends on it.

---

## Three Levels of Identity

AgentSecrets introduces a graduated identity model. Each level adds stronger guarantees while remaining backwards-compatible with the previous one.

| | Anonymous | Declared | Issued |
|---|---|---|---|
| **How it works** | No identification | Agent self-reports a name | Agent presents a cryptographic token |
| **Verification** | None | None (trust-based) | Cryptographically verified |
| **Can be spoofed?** | N/A | Yes | No |
| **Revocable per-agent?** | No | No | Yes |
| **Audit attribution** | `"anonymous"` | `"my-agent"` | `"my-agent"` + token fingerprint |
| **Best for** | Local dev, prototyping | Trusted internal tools | Production, sensitive data |

### Level 0: Anonymous

The default. The agent makes a request through the proxy without identifying itself. The request is still logged, redacted, and allowlisted — but the audit trail shows `anonymous` as the caller.

This is acceptable during local development when you're the only person running a single agent. It becomes a liability the moment you add a second agent or deploy to a shared environment.

### Level 1: Declared

The agent self-reports a name via the `X-AS-Agent-ID` header or the SDK's `agent_id` parameter. The proxy logs this name but does not verify it.

Declared identity is useful for debugging multi-agent pipelines in trusted environments. You can filter audit logs by agent name, trace request flows, and diagnose which agent is generating unexpected calls.

The limitation is that any process can claim any name. A compromised agent could impersonate a trusted one.

### Level 2: Issued (Cryptographic)

The agent presents a cryptographic token (prefixed with `agt_`) that was issued by a workspace administrator via the CLI. The proxy validates the token against the workspace before resolving any credentials.

Issued tokens provide:
- **Proof of origin**: The token cryptographically ties the request to a specific registered agent
- **Instant revocation**: A single token can be revoked without affecting other agents
- **Capability enforcement**: Tokens can be scoped to specific secrets and projects
- **Tamper-proof audit**: The token fingerprint is permanently recorded in the forensic log

---

## How Identity Flows Through the System

When a request passes through the proxy, the agent's identity is captured at the point of credential resolution and carried through every downstream system:

```
Agent Request
    │
    ▼
┌─────────────────────────────┐
│      Credential Proxy       │
│                             │
│  1. Extract identity        │
│     (header / token / none) │
│                             │
│  2. Validate (if issued)    │
│     token → verify → cache  │
│                             │
│  3. Enforce capabilities    │
│     Can this agent access   │
│     this secret?            │
│                             │
│  4. Resolve credential      │
│     Inject into request     │
│                             │
│  5. Write audit entry       │
│     agent_id + level +      │
│     token fingerprint       │
└─────────────┬───────────────┘
              │
              ▼
      Forensic Audit Log
      (signed, chained, synced)
```

The identity is recorded in the audit log alongside the request metadata. This means you can:
- Filter all requests by a specific agent
- See which identity level each request used
- Detect if anonymous requests are happening in production
- Trace a billing anomaly back to the exact agent and token

---

## Identity as a Security Boundary

Agent Identity is not just an audit feature — it is the foundation for runtime access control.

**Capabilities**: Each issued token can be scoped to a subset of secrets. An agent registered as `email-sender` can be restricted to only `SENDGRID_KEY`, structurally preventing it from ever touching `STRIPE_KEY`, even if prompt-injected.

**Secret Policies**: Individual secrets can require specific identity levels. A production database credential can be configured to reject anonymous requests entirely, forcing agents to present verified tokens.

**Revocation without downtime**: When you revoke a token, only that agent loses access. Every other agent in the workspace continues operating. No credential rotation, no deployment restart, no downtime.

---

## The Identity Upgrade Path

AgentSecrets is designed so that upgrading identity levels requires no architectural changes. The same proxy, the same secrets, the same audit log:

1. **Start anonymous**: Get your agent working. Focus on the integration logic.
2. **Add declared identity**: Pass `agent_id` in your requests. Your audit logs immediately gain attribution.
3. **Issue tokens**: When you're ready for production, register the agent and issue a token. Capabilities and revocation are now available.

Each step is additive. Nothing breaks when you upgrade.

See the [Agent Identity CLI Reference](/docs/agent-identity/overview) for step-by-step setup instructions, and [Finding Coverage Gaps](/docs/agent-identity/anonymous-gaps) to identify which agents in your workspace are still running anonymously.
