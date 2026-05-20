# Guides Overview

Practical step-by-step walkthroughs for common workflows, integrations, and deployment scenarios using AgentSecrets.

<style>
  .guides-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 32px;
  }
  @media (min-width: 768px) {
    .guides-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .guide-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    background: #FAFAFA;
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 12px;
    text-decoration: none !important;
    color: inherit !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .guide-card:hover {
    background: #FFFFFF;
    border-color: rgba(0,127,106,0.25);
    box-shadow: 0 6px 20px rgba(0,0,0,0.04);
    transform: translateY(-2px);
  }
  .guide-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }
  .guide-card-title {
    font-weight: 600;
    font-size: 15px;
    color: #1B1B1B !important;
    margin: 0;
  }
  .guide-card-tag {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #007F6A;
    background: rgba(0,255,135,0.08);
    padding: 2px 8px;
    border-radius: 99px;
  }
  .guide-card-desc {
    color: #666666 !important;
    font-size: 13px;
    line-height: 1.5;
    margin: 0;
  }
</style>

<div class="guides-grid">

  <a href="/docs/guides/stripe" class="guide-card">
    <div class="guide-card-header">
      <h3 class="guide-card-title">Stripe Integration</h3>
      <span class="guide-card-tag">Payments</span>
    </div>
    <p class="guide-card-desc">Safely route Stripe transactions through the proxy and hide secret keys from AI models.</p>
  </a>

  <a href="/docs/guides/openai" class="guide-card">
    <div class="guide-card-header">
      <h3 class="guide-card-title">OpenAI Integration</h3>
      <span class="guide-card-tag">LLMs</span>
    </div>
    <p class="guide-card-desc">Inject keys into the official OpenAI SDK at the transport layer for secure completions.</p>
  </a>

  <a href="/docs/guides/multi-agent" class="guide-card">
    <div class="guide-card-header">
      <h3 class="guide-card-title">Multi-Agent Setup</h3>
      <span class="guide-card-tag">Orchestration</span>
    </div>
    <p class="guide-card-desc">Enforce fine-grained access controls and isolation between multiple specialized agents.</p>
  </a>

  <a href="/docs/guides/onboarding-developer" class="guide-card">
    <div class="guide-card-header">
      <h3 class="guide-card-title">Onboarding Team</h3>
      <span class="guide-card-tag">Workflow</span>
    </div>
    <p class="guide-card-desc">Negotiate team credentials securely with end-to-end encrypted local key sharing.</p>
  </a>

  <a href="/docs/guides/cicd" class="guide-card">
    <div class="guide-card-header">
      <h3 class="guide-card-title">CI/CD Pipeline</h3>
      <span class="guide-card-tag">Automation</span>
    </div>
    <p class="guide-card-desc">Integrate Zero-Knowledge secret retrieval into your GitHub Actions and build workflows.</p>
  </a>

  <a href="/docs/guides/build-zk-mcp" class="guide-card">
    <div class="guide-card-header">
      <h3 class="guide-card-title">Publishing ZK MCP</h3>
      <span class="guide-card-tag">Ecosystem</span>
    </div>
    <p class="guide-card-desc">Build and package a Model Context Protocol (MCP) server that operates credentialless.</p>
  </a>

  <a href="/docs/guides/rotate-credential" class="guide-card">
    <div class="guide-card-header">
      <h3 class="guide-card-title">Rotating Credentials</h3>
      <span class="guide-card-tag">Security</span>
    </div>
    <p class="guide-card-desc">Update and sync compromised keys without causing runtime downtime for active agents.</p>
  </a>

  <a href="/docs/guides/audit-team" class="guide-card">
    <div class="guide-card-header">
      <h3 class="guide-card-title">Auditing Team Activity</h3>
      <span class="guide-card-tag">Compliance</span>
    </div>
    <p class="guide-card-desc">Stream proxy event logs to standard stdout or external SIEM platforms for monitoring.</p>
  </a>

  <a href="/docs/guides/dev-to-production" class="guide-card">
    <div class="guide-card-header">
      <h3 class="guide-card-title">Dev to Production</h3>
      <span class="guide-card-tag">Operations</span>
    </div>
    <p class="guide-card-desc">Transition application execution from local environments to production servers securely.</p>
  </a>

  <a href="/docs/guides/monorepo" class="guide-card">
    <div class="guide-card-header">
      <h3 class="guide-card-title">Monorepo Setup</h3>
      <span class="guide-card-tag">Architecture</span>
    </div>
    <p class="guide-card-desc">Manage environment coverage for multiple independent project scopes in a unified repository.</p>
  </a>

</div>
