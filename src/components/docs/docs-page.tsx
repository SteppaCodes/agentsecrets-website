"use client";
import { useState, useEffect, useRef } from "react";
import { CodeWindow, McpJsonWindow } from "@/components/ui/code-window";

const SECTIONS = [
  { id: "overview", group: "Introduction", label: "Overview" },
  { id: "quickstart", group: "Introduction", label: "Quick Start" },
  { id: "howworks", group: "Core Concepts", label: "How It Works" },
  { id: "keychain", group: "Core Concepts", label: "OS Keychain" },
  { id: "zerok", group: "Core Concepts", label: "Zero-Knowledge Design" },
  { id: "mcp", group: "Integrations", label: "MCP / Claude Desktop" },
  { id: "proxy", group: "Integrations", label: "HTTP Proxy" },
  { id: "cliref", group: "Integrations", label: "CLI Direct" },
  { id: "envinjection", group: "Integrations", label: "Env Injection" },
  { id: "openclaw", group: "Integrations", label: "OpenClaw" },
  { id: "clifull", group: "Reference", label: "Full CLI Reference" },
  { id: "auth", group: "Reference", label: "Auth Methods" },
  { id: "audit", group: "Reference", label: "Audit Log Schema" },
  { id: "security", group: "Reference", label: "Security Model" },
];

function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--muted)", marginBottom: 28 }}>
      {items.map((item, i) => (
        <span key={i} style={{ color: i === items.length - 1 ? "var(--em)" : "var(--muted)" }}>
          {i > 0 && <span style={{ marginRight: 8, color: "var(--muted)" }}>›</span>}
          {item}
        </span>
      ))}
    </div>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 700, letterSpacing: "-0.8px", marginBottom: 16, lineHeight: 1.1 }}>
      {children}
    </h1>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, marginTop: 40, letterSpacing: "-0.3px" }}>
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, marginTop: 28, color: "var(--em)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 2, marginBottom: 16 }}>
      {children}
    </p>
  );
}

function Callout({ children, warn }: { children: React.ReactNode; warn?: boolean }) {
  return (
    <div style={{
      border: `1px solid ${warn ? "rgba(255,184,0,0.35)" : "var(--border-em)"}`,
      background: warn ? "rgba(255,184,0,0.04)" : "rgba(0,255,135,0.04)",
      borderRadius: 10,
      padding: "16px 20px",
      margin: "20px 0",
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{warn ? "⚠️" : "🔐"}</span>
      <div style={{ fontSize: 12, lineHeight: 1.8, color: "var(--text)" }}>{children}</div>
    </div>
  );
}

function DocTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h} style={{ padding: "10px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", textAlign: "left", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.025)" : "none" }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: "11px 16px", fontSize: 12, verticalAlign: "top", lineHeight: 1.7, color: j === 0 ? "var(--em)" : "var(--text)", fontWeight: j === 0 ? 700 : 400 }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Step({ n, title, desc, code }: { n: number; title: string; desc: string; code?: { t: string; c: string } }) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1.5px solid var(--border-em)", background: "rgba(0,255,135,0.07)", color: "var(--em)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
        {n}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.8, marginBottom: code ? 10 : 0 }}>{desc}</div>
        {code && <CodeWindow title="" lines={[code]} />}
      </div>
    </div>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "48px 0" }} />;
}

// ── Inline code for doc prose ──
function C({ children }: { children: string }) {
  return (
    <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4, fontSize: 11.5, color: "var(--text)", fontFamily: "inherit" }}>
      {children}
    </code>
  );
}

export default function DocsPage() {
  const [active, setActive] = useState("overview");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id.replace("doc-", ""));
        });
      },
      { threshold: 0.35, rootMargin: "-60px 0px -40% 0px" }
    );
    document.querySelectorAll("[id^='doc-']").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const jump = (id: string) => {
    setActive(id);
    document.getElementById("doc-" + id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const groups = [...new Set(SECTIONS.map((s) => s.group))];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        minHeight: "100vh",
        paddingTop: 60,
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          position: "sticky",
          top: 60,
          height: "calc(100vh - 60px)",
          overflowY: "auto",
          borderRight: "1px solid var(--border)",
          padding: "32px 20px",
          background: "rgba(6,6,8,0.7)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>AgentSecrets</div>
          <div style={{ fontSize: 10, color: "var(--muted)" }}>
            Documentation{" "}
            <span style={{ color: "var(--am)", border: "1px solid rgba(255,184,0,0.3)", padding: "1px 6px", borderRadius: 4, fontSize: 9 }}>alpha</span>
          </div>
        </div>
        {groups.map((g) => (
          <div key={g} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10, paddingLeft: 8 }}>
              {g}
            </div>
            {SECTIONS.filter((s) => s.group === g).map((s) => (
              <button
                key={s.id}
                onClick={() => jump(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  color: active === s.id ? "var(--em)" : "var(--muted)",
                  background: active === s.id ? "rgba(0,255,135,0.07)" : "transparent",
                  border: `1px solid ${active === s.id ? "var(--border-em)" : "transparent"}`,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textAlign: "left",
                  marginBottom: 2,
                  fontFamily: "inherit",
                }}
              >
                <span
                  style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: "var(--em)",
                    display: "inline-block",
                    opacity: active === s.id ? 1 : 0,
                    transition: "opacity 0.15s",
                    flexShrink: 0,
                  }}
                />
                {s.label}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* Content */}
      <main ref={contentRef} style={{ padding: "48px 56px", maxWidth: 860 }}>

        {/* OVERVIEW */}
        <div id="doc-overview" style={{ marginBottom: 72 }}>
          <Breadcrumb items={["Introduction", "Overview"]} />
          <H1>AgentSecrets <span style={{ fontSize: 12, fontWeight: 700, border: "1px solid rgba(255,184,0,0.4)", color: "var(--am)", background: "rgba(255,184,0,0.08)", padding: "2px 8px", borderRadius: 4, marginLeft: 8, verticalAlign: "middle" }}>Alpha</span></H1>
          <P><strong style={{ color: "var(--text)" }}>AgentSecrets</strong> is a zero-knowledge credential proxy for AI agents. It lets your agent call any authenticated API — Stripe, OpenAI, GitHub, Slack — without the agent ever seeing the actual secret value. The credential lives in your OS keychain and is injected at the HTTP transport layer, never entering the agent&apos;s context, prompt, memory, or logs.</P>
          <Callout>
            <strong style={{ color: "var(--em)" }}>Core guarantee:</strong> The key value is never passed to, logged by, or accessible to the AI agent at any point in the call lifecycle. Not as an argument. Not in the response. Not in the audit log.
          </Callout>
          <H2>Integration modes</H2>
          <DocTable
            headers={["Mode", "Description", "Best for"]}
            rows={[
              ["MCP Server", "Claude Desktop + Cursor via Model Context Protocol", "Claude, Cursor"],
              ["HTTP Proxy", "Local proxy at localhost:8765", "LangChain, CrewAI, AutoGen, curl"],
              ["CLI Direct", "agentsecrets call — one-shot authenticated requests", "Scripts, CI/CD, testing"],
              ["Env Injection", "agentsecrets env -- <cmd> — injects as env vars", "SDKs, native MCPs, any process"],
              ["OpenClaw Skill", "Skill + native exec provider for OpenClaw's SecretRef", "OpenClaw agents"],
            ]}
          />
          <H2>Status</H2>
          <P>AgentSecrets is currently in <strong style={{ color: "var(--text)" }}>alpha</strong>. The CLI surface and MCP schema are stable. Cloud sync and team workspaces are in active development. See the Security Model section for known limitations.</P>
        </div>
        <Divider />

        {/* QUICKSTART */}
        <div id="doc-quickstart" style={{ marginBottom: 72 }}>
          <Breadcrumb items={["Introduction", "Quick Start"]} />
          <H1>Quick Start</H1>
          <P>Get from zero to your first zero-knowledge API call in under 3 minutes.</P>
          <Step n={1} title="Install AgentSecrets" desc="Choose your package manager." code={{ t: "$ npx @the-17/agentsecrets init", c: "c-em" }} />
          <Step n={2} title="Create a project" desc="Creates a local config file and registers with your OS keychain." code={{ t: "$ agentsecrets project create my-agent", c: "c-sky" }} />
          <Step n={3} title="Store a secret" desc="The value is encrypted and stored in your OS keychain immediately. It is never written to disk as plaintext." code={{ t: "$ agentsecrets secrets set STRIPE_KEY=sk_live_...", c: "c-am" }} />
          <Step n={4} title="Make your first authenticated call" desc="Pass the key NAME — not the value. AgentSecrets injects the real credential at the transport layer." code={{ t: "$ agentsecrets call --url https://api.stripe.com/v1/balance --bearer STRIPE_KEY", c: "c-sky" }} />
          <Step n={5} title="(Optional) Connect to Claude Desktop" desc="Auto-installs AgentSecrets as an MCP server. Claude can call APIs without ever seeing your keys." code={{ t: "$ agentsecrets mcp install", c: "c-vi" }} />
          <Callout warn>
            <strong style={{ color: "var(--am)" }}>Alpha status:</strong> The CLI and MCP schema are stable. Cloud sync is in development. Pin your version in production.
          </Callout>
        </div>
        <Divider />

        {/* HOW IT WORKS */}
        <div id="doc-howworks" style={{ marginBottom: 72 }}>
          <Breadcrumb items={["Core Concepts", "How It Works"]} />
          <H1>How It Works</H1>
          <P>Every AgentSecrets call flows through five stages. At no point does the secret value enter the agent&apos;s context, filesystem, or any log.</P>
          <H3>Stage 1 — Agent request</H3>
          <P>The agent calls <C>agentsecrets call</C> and passes the key <strong style={{ color: "var(--am)" }}>name</strong> (e.g. <C>STRIPE_KEY</C>) — not the value. This is structurally all the agent can do.</P>
          <H3>Stage 2 — OS keychain lookup</H3>
          <P>AgentSecrets looks up the encrypted entry in your OS keychain and decrypts it <strong style={{ color: "var(--text)" }}>in-process only</strong>. The plaintext value never hits the filesystem or leaves this process boundary.</P>
          <H3>Stage 3 — Transport injection</H3>
          <P>The decrypted value is injected directly into the outbound HTTP request at the transport layer — e.g. as a Bearer token. It is never returned as a string to the calling process.</P>
          <H3>Stage 4 — API call</H3>
          <P>The HTTP request is sent over TLS 1.3. The remote API receives a properly authenticated request.</P>
          <H3>Stage 5 — Response + audit</H3>
          <P>The API response is returned to the agent. An audit entry is written containing: timestamp, key name, endpoint, HTTP status, and latency. <strong style={{ color: "var(--text)" }}>The value field does not exist in the audit schema.</strong></P>
        </div>
        <Divider />

        {/* KEYCHAIN */}
        <div id="doc-keychain" style={{ marginBottom: 72 }}>
          <Breadcrumb items={["Core Concepts", "OS Keychain"]} />
          <H1>OS Keychain Storage</H1>
          <P>AgentSecrets stores all credentials in your OS&apos;s native secure credential store — not a file, not an environment variable.</P>
          <DocTable
            headers={["Platform", "Backend", "Encryption"]}
            rows={[
              ["macOS", "macOS Keychain (Security framework)", "AES-256-GCM via Secure Enclave"],
              ["Linux", "libsecret / Secret Service API", "GNOME Keyring or KDE Wallet"],
              ["Windows", "Windows Credential Manager", "DPAPI (user-scoped)"],
            ]}
          />
          <Callout>
            Keychain entries are scoped to your user account and cannot be read by other processes without your authentication. This is fundamentally stronger than a <C>.env</C> file, which any process can read.
          </Callout>
        </div>
        <Divider />

        {/* ZERO KNOWLEDGE */}
        <div id="doc-zerok" style={{ marginBottom: 72 }}>
          <Breadcrumb items={["Core Concepts", "Zero-Knowledge Design"]} />
          <H1>Zero-Knowledge Design</H1>
          <P>AgentSecrets is zero-knowledge at every layer — not just at the point of API injection.</P>
          <DocTable
            headers={["Command", "What the agent sees"]}
            rows={[
              ["secrets list", "Key names only"],
              ["secrets diff", "Key names and sync status"],
              ["secrets pull", "Confirmation message — values go to OS keychain"],
              ["agentsecrets call", "API response only"],
              ["agentsecrets env", "Injects values into child process — agent never sees them"],
              ["proxy logs", "Key names, endpoints, status codes"],
            ]}
          />
          <P>The log struct has no value field. It is <strong style={{ color: "var(--text)" }}>structurally impossible</strong> to accidentally log a credential value anywhere in the system.</P>
          <H2>Cloud sync encryption</H2>
          <P>Before any secret leaves your machine, it is encrypted with <strong style={{ color: "var(--text)" }}>X25519 key exchange + AES-256-GCM</strong>. The encryption key lives only in your OS keychain. The server receives and stores only ciphertext — it structurally cannot decrypt your secrets.</P>
        </div>
        <Divider />

        {/* MCP */}
        <div id="doc-mcp" style={{ marginBottom: 72 }}>
          <Breadcrumb items={["Integrations", "MCP / Claude Desktop"]} />
          <H1>MCP Integration <span style={{ fontSize: 12, fontWeight: 700, border: "1px solid rgba(0,255,135,0.4)", color: "var(--em)", background: "rgba(0,255,135,0.08)", padding: "2px 8px", borderRadius: 4, marginLeft: 8 }}>Recommended</span></H1>
          <P>The MCP integration lets Claude Desktop and Cursor call any authenticated API through AgentSecrets. Claude asks for data by key name — it never sees the credential value.</P>
          <H3>Auto-install</H3>
          <CodeWindow title="auto-configure" lines={[
            { t: "$ agentsecrets mcp install", c: "c-em" },
            { t: "  ✓ Detected Claude Desktop", c: "c-mu" },
            { t: "  ✓ Written to claude_desktop_config.json", c: "c-mu" },
            { t: "  ✓ Restart Claude Desktop to activate", c: "c-mu" },
          ]} />
          <H3>Manual config</H3>
          <McpJsonWindow />
          <H3>Available MCP tools</H3>
          <DocTable
            headers={["Tool", "Description"]}
            rows={[
              ["api_call", "Make an authenticated HTTP request. Pass key name, URL, method, optional body."],
              ["list_keys", "List available key names in the current project (names only, never values)."],
              ["check_status", "Returns current workspace, project, and keychain connectivity status."],
            ]}
          />
          <Callout>
            <strong style={{ color: "var(--em)" }}>Try it:</strong> After installation, ask Claude: &ldquo;Check my Stripe balance using STRIPE_KEY&rdquo;. Claude calls <C>api_call</C> with the key name. It will never see <C>sk_live_...</C>.
          </Callout>
        </div>
        <Divider />

        {/* PROXY */}
        <div id="doc-proxy" style={{ marginBottom: 72 }}>
          <Breadcrumb items={["Integrations", "HTTP Proxy"]} />
          <H1>HTTP Proxy Mode</H1>
          <P>Start a local HTTP proxy at <C>localhost:8765</C>. Agents send requests with injection headers. The proxy resolves from the OS keychain, injects into the outbound request, returns only the response.</P>
          <CodeWindow title="proxy" lines={[
            { t: "$ agentsecrets proxy start", c: "c-em" },
            { t: "", c: "" },
            { t: "$ curl http://localhost:8765/proxy \\", c: "c-sky" },
            { t: '  -H "X-AS-Target-URL: https://api.stripe.com/v1/balance" \\', c: "c-sky" },
            { t: '  -H "X-AS-Inject-Bearer: STRIPE_KEY"', c: "c-am" },
          ]} />
          <H2>Supported injection headers</H2>
          <DocTable
            headers={["Header", "Injects as", "Example"]}
            rows={[
              ["X-AS-Inject-Bearer", "Authorization: Bearer <value>", "STRIPE_KEY"],
              ["X-AS-Inject-Basic", "Authorization: Basic base64(user:pass)", "USER:PASS_KEY"],
              ["X-AS-Inject-Header", "Custom header: <value>", "X-API-Key=MY_KEY"],
              ["X-AS-Inject-Query", "URL query param ?key=<value>", "API_KEY"],
              ["X-AS-Inject-Cookie", "Cookie: name=<value>", "SESSION_KEY"],
            ]}
          />
        </div>
        <Divider />

        {/* CLI DIRECT */}
        <div id="doc-cliref" style={{ marginBottom: 72 }}>
          <Breadcrumb items={["Integrations", "CLI Direct"]} />
          <H1>CLI Direct Mode</H1>
          <P>Use <C>agentsecrets call</C> directly from any shell, script, or agent subprocess. No proxy required.</P>
          <CodeWindow title="cli direct" lines={[
            { t: "$ agentsecrets call \\", c: "c-em" },
            { t: "    --url https://api.stripe.com/v1/balance \\", c: "c-em" },
            { t: "    --bearer STRIPE_KEY", c: "c-em" },
            { t: "", c: "" },
            { t: "# Custom header auth", c: "c-di" },
            { t: "$ agentsecrets call --url https://api.sendgrid.com/v3/mail/send \\", c: "c-sky" },
            { t: "    --header X-Api-Key=SENDGRID_KEY", c: "c-sky" },
            { t: "", c: "" },
            { t: "# Query parameter", c: "c-di" },
            { t: '$ agentsecrets call --url "https://maps.googleapis.com/maps/api/geocode/json" \\', c: "c-am" },
            { t: "    --query key=GMAP_KEY", c: "c-am" },
          ]} />
        </div>
        <Divider />

        {/* ENV INJECTION */}
        <div id="doc-envinjection" style={{ marginBottom: 72 }}>
          <Breadcrumb items={["Integrations", "Env Injection"]} />
          <H1>Environment Variable Injection</H1>
          <P>For tools that manage their own credential storage (Stripe CLI) or SDKs that read from environment variables: wrap any command with <C>agentsecrets env --</C>. Values exist only in the child process memory and are gone when it exits.</P>
          <CodeWindow title="env injection" lines={[
            { t: "$ agentsecrets env -- stripe mcp", c: "c-em" },
            { t: "$ agentsecrets env -- node server.js", c: "c-em" },
            { t: "$ agentsecrets env -- npm run dev", c: "c-em" },
            { t: "", c: "" },
            { t: "# Claude Desktop wrapping native Stripe MCP:", c: "c-di" },
            { t: '# "command": "agentsecrets", "args": ["env", "--", "stripe", "mcp"]', c: "c-mu" },
          ]} />
        </div>
        <Divider />

        {/* OPENCLAW */}
        <div id="doc-openclaw" style={{ marginBottom: 72 }}>
          <Breadcrumb items={["Integrations", "OpenClaw"]} />
          <H1>OpenClaw Integration</H1>
          <P>AgentSecrets ships as both a <strong style={{ color: "var(--text)" }}>ClawHub skill</strong> and a native exec provider for OpenClaw&apos;s SecretRef system (shipped in v2026.2.26). The agent manages the full secrets workflow autonomously within OpenClaw.</P>
          <CodeWindow title="openclaw" lines={[
            { t: "$ openclaw skill install agentsecrets", c: "c-em" },
            { t: "", c: "" },
            { t: "# Or manual:", c: "c-di" },
            { t: "$ cp -r integrations/openclaw ~/.openclaw/skills/agentsecrets", c: "c-sky" },
            { t: "", c: "" },
            { t: "$ openclaw skill list | grep agentsecrets", c: "c-mu" },
            { t: "  agentsecrets  v0.4.2  ✓ active", c: "c-em" },
          ]} />
        </div>
        <Divider />

        {/* CLI FULL REFERENCE */}
        <div id="doc-clifull" style={{ marginBottom: 72 }}>
          <Breadcrumb items={["Reference", "Full CLI Reference"]} />
          <H1>Full CLI Reference</H1>
          <H2>Project</H2>
          <CodeWindow title="project commands" lines={[
            { t: "$ agentsecrets init", c: "c-em" },
            { t: "$ agentsecrets project create <name>", c: "c-em" },
            { t: "$ agentsecrets project list", c: "c-sky" },
            { t: "$ agentsecrets project switch <name>", c: "c-sky" },
            { t: "$ agentsecrets status", c: "c-sky" },
          ]} />
          <H2>Secrets</H2>
          <CodeWindow title="secrets commands" lines={[
            { t: "$ agentsecrets secrets set KEY=value", c: "c-em" },
            { t: "$ agentsecrets secrets get KEY", c: "c-sky" },
            { t: "$ agentsecrets secrets list", c: "c-sky" },
            { t: "$ agentsecrets secrets delete KEY", c: "c-re" },
            { t: "$ agentsecrets secrets push", c: "c-am" },
            { t: "$ agentsecrets secrets pull", c: "c-am" },
            { t: "$ agentsecrets secrets diff", c: "c-vi" },
          ]} />
          <H2>Proxy</H2>
          <CodeWindow title="proxy commands" lines={[
            { t: "$ agentsecrets proxy start [--port N]", c: "c-em" },
            { t: "$ agentsecrets proxy stop", c: "c-re" },
            { t: "$ agentsecrets proxy status", c: "c-sky" },
            { t: "$ agentsecrets proxy logs [--last N]", c: "c-am" },
          ]} />
          <H2>Team Workspaces</H2>
          <CodeWindow title="workspace commands" lines={[
            { t: "$ agentsecrets workspace create \"Acme Engineering\"", c: "c-em" },
            { t: "$ agentsecrets workspace invite alice@acme.com", c: "c-em" },
            { t: "$ agentsecrets workspace switch \"Acme Engineering\"", c: "c-am" },
            { t: "$ agentsecrets workspace allowlist add api.stripe.com api.openai.com", c: "c-sky" },
          ]} />
        </div>
        <Divider />

        {/* AUTH METHODS */}
        <div id="doc-auth" style={{ marginBottom: 72 }}>
          <Breadcrumb items={["Reference", "Auth Methods"]} />
          <H1>Auth Injection Methods</H1>
          <DocTable
            headers={["Flag", "Injects as", "Use case"]}
            rows={[
              ["--bearer KEY", "Authorization: Bearer <value>", "OAuth, Stripe, OpenAI, GitHub"],
              ["--basic KEY", "Authorization: Basic <value>", "HTTP Basic Auth, Jira"],
              ["--header KEY:X-Custom", "X-Custom: <value>", "SendGrid, Twilio, custom APIs"],
              ["--query key=KEY", "?key=<value> in URL", "Google Maps, weather APIs"],
              ["--body-field field=KEY", "JSON body field injection", "OAuth flows"],
              ["--form-field field=KEY", "Form data field injection", "Legacy form-based auth"],
            ]}
          />
        </div>
        <Divider />

        {/* AUDIT LOG */}
        <div id="doc-audit" style={{ marginBottom: 72 }}>
          <Breadcrumb items={["Reference", "Audit Log Schema"]} />
          <H1>Audit Log Schema</H1>
          <P>Every call writes a JSONL entry. The schema intentionally omits a value field — it was never designed to hold one.</P>
          <CodeWindow title="~/.agentsecrets/audit.jsonl" lines={[
            { t: "{", c: "c-wh" },
            { t: '  "ts":      "2025-03-04T12:04:11.342Z",', c: "c-sky" },
            { t: '  "project": "my-agent",', c: "c-sky" },
            { t: '  "key":     "STRIPE_KEY",', c: "c-am" },
            { t: '  "method":  "GET",', c: "c-wh" },
            { t: '  "url":     "https://api.stripe.com/v1/balance",', c: "c-wh" },
            { t: '  "status":  200,', c: "c-em" },
            { t: '  "ms":      143', c: "c-wh" },
            { t: "}", c: "c-wh" },
            { t: "", c: "" },
            { t: "# Note: no 'value' field. It does not exist in this schema.", c: "c-re" },
          ]} />
          <Callout>
            <strong style={{ color: "var(--em)" }}>Why no value field?</strong> Omission is stronger than redaction. A redacted field can potentially be un-redacted. A field that was never written cannot be recovered, subpoenaed, or leaked.
          </Callout>
        </div>
        <Divider />

        {/* SECURITY MODEL */}
        <div id="doc-security" style={{ marginBottom: 72 }}>
          <Breadcrumb items={["Reference", "Security Model"]} />
          <H1>Security Model</H1>
          <P>AgentSecrets is designed around <strong style={{ color: "var(--text)" }}>structural impossibility</strong> rather than policy enforcement.</P>
          <DocTable
            headers={["Threat", "Mitigation"]}
            rows={[
              ["Agent reads .env file", "No .env file — secrets in OS keychain only"],
              ["Agent logs credential in output", "Value never enters agent context — nothing to log"],
              ["Malicious MCP skill intercepts", "Injection happens at transport, after skill boundary"],
              ["Server-side breach", "Server holds AES-256-GCM ciphertext — undecryptable without your keychain key"],
              ["Memory scraping", "Decrypted value held in memory for <1ms, then cleared"],
              ["Audit log leak", "Value field does not exist in schema — cannot be present"],
              ["Prompt injection exfiltration", "Response body redaction scans for credential patterns before returning to agent"],
              ["Unauthorized domain", "Domain allowlist enforcement — deny-by-default at proxy level"],
              ["Replay attack", "Each call uses a fresh nonce; TLS session prevents replay"],
            ]}
          />
          <Callout warn>
            <strong style={{ color: "var(--am)" }}>Responsible disclosure:</strong> Please report security vulnerabilities to{" "}
            <a href="mailto:hello@theseventeen.co" style={{ color: "var(--am)" }}>hello@theseventeen.co</a>{" "}
            — do not open public GitHub issues for security findings.
          </Callout>
        </div>

      </main>
    </div>
  );
}
