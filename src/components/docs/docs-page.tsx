"use client";
import { useState, useEffect, useRef } from "react";
import { CodeWindow, McpJsonWindow } from "@/components/ui/code-window";

const DOCS_SECTIONS = [
  { id: "overview",      group: "Introduction",  label: "Overview" },
  { id: "quickstart",    group: "Introduction",  label: "Getting Started" },
  { id: "howworks",      group: "Core Concepts", label: "How It Works" },
  { id: "keychain",      group: "Core Concepts", label: "OS Keychain" },
  { id: "zerok",         group: "Core Concepts", label: "Zero-Knowledge Design" },
  { id: "allowlist",     group: "Core Concepts", label: "Domain Allowlist" },
  { id: "redaction",     group: "Core Concepts", label: "Response Redaction" },
  { id: "mcp",           group: "Integrations",  label: "MCP / Claude Desktop" },
  { id: "proxy-int",     group: "Integrations",  label: "HTTP Proxy" },
  { id: "sdk-int",       group: "Integrations",  label: "Python SDK" },
  { id: "env-int",       group: "Integrations",  label: "agentsecrets env" },
  { id: "openclaw-i",    group: "Integrations",  label: "OpenClaw" },
  { id: "cli-full",      group: "Reference",     label: "CLI Reference" },
  { id: "sdk-ref",       group: "Reference",     label: "SDK Reference" },
  { id: "auth-methods",  group: "Reference",     label: "Auth Methods" },
  { id: "audit",         group: "Reference",     label: "Audit Log Schema" },
  { id: "architecture",  group: "Reference",     label: "Architecture" },
  { id: "security",      group: "Reference",     label: "Security Model" },
  { id: "pricing",       group: "Reference",     label: "Pricing" },
];

/* ─── small shared atoms ─────────────────────────────────────── */

function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--muted)", marginBottom: 28, flexWrap: "wrap" }}>
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
    <h1 className="docs-h1" style={{ fontWeight: 700, letterSpacing: "-0.8px", marginBottom: 16, lineHeight: 1.1 }}>
      {children}
    </h1>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="docs-h2" style={{ fontWeight: 700, marginBottom: 12, marginTop: 40, letterSpacing: "-0.3px" }}>
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="docs-h3" style={{ fontWeight: 700, marginBottom: 8, marginTop: 28, color: "var(--em)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="docs-p" style={{ color: "var(--muted)", lineHeight: 2, marginBottom: 16 }}>
      {children}
    </p>
  );
}

function Callout({ children, warn, icon }: { children: React.ReactNode; warn?: boolean; icon?: string }) {
  const defaultIcon = warn ? "⚠️" : "🔐";
  return (
    <div className="docs-callout" style={{
      border: `1px solid ${warn ? "rgba(255,184,0,0.35)" : "var(--border-em)"}`,
      background: warn ? "rgba(255,184,0,0.04)" : "rgba(0,255,135,0.04)",
      borderRadius: 10,
      margin: "20px 0",
    }}>
      <span className="docs-callout-icon" style={{ flexShrink: 0, marginTop: 1 }}>{icon || defaultIcon}</span>
      <div style={{ fontSize: 12, lineHeight: 1.8, color: "var(--text)" }}>{children}</div>
    </div>
  );
}

function DocTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="docs-table-wrap" style={{ borderRadius: 10 }}>
      <table className="docs-table" style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0", border: "1px solid var(--border)" }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} style={{ padding: "10px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", textAlign: "left", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--overlay)" : "none" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "11px 16px", fontSize: 12, verticalAlign: "top", lineHeight: 1.7, color: j === 0 ? "var(--em)" : "var(--text)", fontWeight: j === 0 ? 700 : 400 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Step({ n, title, desc, code }: { n: number; title: string; desc: string; code?: { t: string; c: string }[] | { t: string; c: string } }) {
  const lineArray = Array.isArray(code) ? code : (code ? [code] : undefined);
  return (
    <div className="docs-step" style={{ marginBottom: 20 }}>
      <div className="docs-step-num" style={{ marginTop: 2 }}>
        {n}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.8, marginBottom: lineArray ? 10 : 0 }}>{desc}</div>
        {lineArray && <CodeWindow title="" lines={lineArray} />}
      </div>
    </div>
  );
}

function Divider() {
  return <hr className="docs-divider" style={{ border: "none", borderTop: "1px solid var(--border)" }} />;
}

function C({ children }: { children: string }) {
  return (
    <code style={{ background: "var(--overlay)", padding: "2px 6px", borderRadius: 4, fontSize: 11.5, color: "var(--text)", fontFamily: "inherit" }}>
      {children}
    </code>
  );
}

/* ─── Sidebar nav content — shared between desktop & mobile drawer ─── */
function SidebarContent({
  active,
  groups,
  onJump,
}: {
  active: string;
  groups: string[];
  onJump: (id: string) => void;
}) {
  return (
    <>
      {/* Brand */}
      <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>AgentSecrets</div>
        <div style={{ fontSize: 10, color: "var(--muted)" }}>
          Documentation{" "}
          <span style={{ color: "var(--am)", border: "1px solid rgba(255,184,0,0.3)", padding: "1px 6px", borderRadius: 4, fontSize: 9 }}>alpha</span>
        </div>
      </div>

      {/* Nav groups */}
      {groups.map((g) => (
        <div key={g} style={{ marginBottom: 28 }}>
          <div style={{
            fontSize: 9, color: "var(--muted)", letterSpacing: "0.14em",
            textTransform: "uppercase", marginBottom: 8, paddingLeft: 8,
          }}>
            {g}
          </div>
          {DOCS_SECTIONS.filter((s) => s.group === g).map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onJump(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  color: isActive ? "var(--em)" : "var(--muted)",
                  background: isActive ? "rgba(0,255,135,0.07)" : "transparent",
                  border: `1px solid ${isActive ? "var(--border-em)" : "transparent"}`,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textAlign: "left",
                  marginBottom: 2,
                  fontFamily: "inherit",
                }}
              >
                <span style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: "var(--em)",
                  display: "inline-block",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 0.15s",
                  flexShrink: 0,
                }} />
                {s.label}
              </button>
            );
          })}
        </div>
      ))}
    </>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function DocsPage() {
  const [active, setActive] = useState("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Intersection observer — tracks which section is in view
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id.replace("doc-", ""));
        });
      },
      { threshold: 0.2, rootMargin: "-60px 0px -45% 0px" }
    );
    document.querySelectorAll("[id^='doc-']").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const jump = (id: string) => {
    setActive(id);
    setDrawerOpen(false);
    // Small delay so the drawer close animation doesn't fight the scroll
    setTimeout(() => {
      document.getElementById("doc-" + id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const groups = [...new Set(DOCS_SECTIONS.map((s) => s.group))];

  // Label of the currently active section — used in the mobile FAB
  const activeLabel = DOCS_SECTIONS.find((s) => s.id === active)?.label ?? "Overview";

  return (
    <>
      {/* ── Drawer overlay backdrop ── */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* ── Mobile slide-in drawer ── */}
      <div
        className="docs-drawer"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          zIndex: 201,
          background: "var(--bg2)",
          borderRight: "1px solid var(--border)",
          padding: "80px 20px 40px",
          paddingBottom: "max(40px, env(safe-area-inset-bottom))",
          overflowY: "auto",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
        }}
      >
        {/* Close button inside drawer */}
        <button
          onClick={() => setDrawerOpen(false)}
          aria-label="Close navigation"
          style={{
            position: "absolute",
            top: 18,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--overlay)",
            color: "var(--muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          ✕
        </button>

        <SidebarContent active={active} groups={groups} onJump={jump} />
      </div>

      {/* ── Mobile FAB — always visible on mobile, tells you where you are ── */}
      <button
        className="docs-fab"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open documentation navigation"
        style={{
          position: "fixed",
          bottom: "max(24px, env(safe-area-inset-bottom, 24px))",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 199,
          alignItems: "center",
          gap: 8,
          padding: "10px 18px",
          background: "var(--bg2)",
          border: "1px solid var(--border-em)",
          borderRadius: 100,
          color: "var(--text)",
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "inherit",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px var(--border-em)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          whiteSpace: "nowrap",
          maxWidth: "calc(100vw - 48px)",
        }}
      >
        {/* Animated green dot */}
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "var(--em)",
          boxShadow: "0 0 8px var(--em)",
          flexShrink: 0,
          animation: "pring 2.5s ease-in-out infinite",
        }} />
        <span style={{ color: "var(--muted)", fontSize: 10 }}>§</span>
        <span style={{
          maxWidth: 180,
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: "var(--em)",
        }}>
          {activeLabel}
        </span>
        <span style={{ color: "var(--muted)", fontSize: 10, marginLeft: 2 }}>≡</span>
      </button>

      {/* ── Page layout ── */}
      <div
        className="docs-layout"
        style={{
          display: "grid",
          minHeight: "100vh",
          paddingTop: 60,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="docs-sidebar" />
        {/* ── Desktop fixed sidebar ── */}
        <aside
          className="docs-sidebar"
          style={{
            position: "fixed",
            left: 0,
            width: 240,
            top: 60,
            height: "calc(100vh - 60px)",
            overflowY: "auto",
            borderRight: "1px solid var(--border)",
            padding: "32px 20px",
            paddingBottom: "max(32px, env(safe-area-inset-bottom))",
            background: "var(--nav-bg)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <SidebarContent active={active} groups={groups} onJump={jump} />
        </aside>

        {/* ── Main content ── */}
        <main ref={contentRef} className="docs-content">

          {/* ─────────────────────────────────────────────────
              OVERVIEW
          ───────────────────────────────────────────────── */}
          <div id="doc-overview" className="docs-section">
            <Breadcrumb items={["Introduction", "Overview"]} />
            <H1>AgentSecrets <span style={{ fontSize: 12, fontWeight: 700, border: "1px solid rgba(255,184,0,0.4)", color: "var(--am)", background: "rgba(255,184,0,0.08)", padding: "2px 8px", borderRadius: 4, marginLeft: 8, verticalAlign: "middle" }}>Alpha</span></H1>
            <P>AgentSecrets is a zero-knowledge credential proxy for AI agents. It lets your agent call any authenticated API — Stripe, OpenAI, GitHub, Slack — without the agent ever seeing the actual secret value. The credential lives in your OS keychain and is injected at the HTTP transport layer, never entering the agent's context window, memory, or logs.</P>
            <Callout icon="🔐">
              <strong style={{ color: "var(--text)" }}>Core guarantee:</strong> The key value is never passed to, logged by, or accessible to the AI agent at any point in the call lifecycle. Not as an argument. Not in the response. Not in the audit log.
            </Callout>
            <P>The proxy runs at localhost:8765. Your code sends key names. The proxy resolves values from the OS keychain and injects them at the transport layer. Your code receives the API response. The value never crossed into your process.</P>
            <P>Everything is open source under the MIT license. The CLI, the proxy, the SDK, and the MCP template are all free to use, fork, and self-host.</P>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              QUICKSTART
          ───────────────────────────────────────────────── */}
          <div id="doc-quickstart" className="docs-section">
            <Breadcrumb items={["Introduction", "Getting Started"]} />
            <H1>Getting Started</H1>
            <P>Install AgentSecrets, store your first secret, and make your first zero-knowledge API call.</P>

            <Step n={1} title="Install the CLI" desc="The CLI manages your credentials, runs the local proxy, and handles workspace and project context." code={[
              { t: "$ brew install The-17/tap/agentsecrets", c: "c-em" },
              { t: "", c: "" },
              { t: "# Also available via:", c: "c-di" },
              { t: "$ npm install -g @the-17/agentsecrets", c: "c-mu" },
              { t: "$ pip install agentsecrets-cli", c: "c-mu" },
              { t: "$ go install github.com/The-17/agentsecrets/cmd/agentsecrets@latest", c: "c-mu" },
              { t: "", c: "" },
              { t: "$ agentsecrets --version", c: "c-sky" }
            ]} />

            <Step n={2} title="Initialize" desc="Creates your account, generates your encryption keys locally, and sets up your first workspace. Your keys never leave your machine. Everything synced to the cloud is encrypted client-side before upload. The server holds ciphertext and cannot decrypt it." code={{ t: "$ agentsecrets init", c: "c-em" }} />

            <Step n={3} title="Create a project" desc="Projects partition your secrets within a workspace. One project per service or environment is a reasonable starting point." code={[
              { t: "$ agentsecrets project create my-agent", c: "c-sky" },
              { t: "$ agentsecrets project use my-agent", c: "c-sky" }
            ]} />

            <Step n={4} title="Store your credentials" desc="The value goes directly to the OS keychain. It is never written to disk in plaintext and never sent to the AgentSecrets server in plaintext." code={[
              { t: "$ agentsecrets secrets set STRIPE_KEY=sk_live_...", c: "c-am" },
              { t: "$ agentsecrets secrets set OPENAI_KEY=sk-proj-...", c: "c-am" },
              { t: "", c: "" },
              { t: "# Push an existing .env file:", c: "c-di" },
              { t: "$ agentsecrets secrets push", c: "c-mu" }
            ]} />

            <Step n={5} title="Authorize your domains" desc="The proxy is deny-by-default. Every domain your agent calls must be explicitly authorized. This blocks SSRF attacks and prompt injection attempts that try to route credentials to attacker-controlled URLs." code={[
              { t: "$ agentsecrets workspace allowlist add api.stripe.com", c: "c-em" },
              { t: "$ agentsecrets workspace allowlist add api.openai.com", c: "c-em" }
            ]} />

            <Step n={6} title="Start the proxy" desc="The proxy runs on localhost:8765. It resolves credential values from the OS keychain and injects them at the transport layer. Your agent code sends key names. Values never cross into your process." code={[
              { t: "$ agentsecrets proxy start", c: "c-em" },
              { t: "", c: "" },
              { t: "$ agentsecrets status", c: "c-sky" }
            ]} />

            <Step n={7} title="Make your first call" desc="The proxy resolves STRIPE_KEY from the OS keychain, injects it as a bearer token, makes the request, and returns the API response. The value sk_live_... never appeared in your terminal, in any variable, or in any log." code={[
              { t: "$ agentsecrets call \\", c: "c-em" },
              { t: "    --url https://api.stripe.com/v1/balance \\", c: "c-em" },
              { t: "    --bearer STRIPE_KEY", c: "c-em" },
              { t: "", c: "" },
              { t: "$ agentsecrets proxy logs --last 5", c: "c-sky" },
              { t: "# Key names. Endpoints. Status codes. No value field.", c: "c-di" }
            ]} />

            <Step n={8} title="Connect to Claude Desktop" desc="Writes your Claude Desktop config automatically. No env block, no credential values. Restart Claude Desktop and ask it to check your Stripe balance." code={{ t: "$ agentsecrets mcp install", c: "c-em" }} />
            <McpJsonWindow />

            <Callout warn icon="⚠️">
              Alpha status: The CLI surface and MCP schema are stable. Cloud sync and team workspaces are in active development. Pin your version in production.
            </Callout>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              HOW IT WORKS
          ───────────────────────────────────────────────── */}
          <div id="doc-howworks" className="docs-section">
            <Breadcrumb items={["Core Concepts", "How It Works"]} />
            <H1>How It Works</H1>
            <P>Every AgentSecrets call flows through five stages. At no point does the secret value enter the agent's context, filesystem, or any log.</P>

            <H3>Stage 1 — Agent request</H3>
            <P>The agent (Claude, your script, any MCP client) calls <C>agentsecrets call</C> or <C>client.call()</C> and passes the key name — e.g. <C>STRIPE_KEY</C> — not the value. The proxy address is localhost:8765.</P>

            <H3>Stage 2 — OS keychain lookup</H3>
            <P>The proxy looks up the encrypted entry in the OS keychain (macOS Keychain, Linux Secret Service, or Windows Credential Manager) and decrypts it in-process only. The decrypted value is never written to disk or returned to the caller.</P>

            <H3>Stage 3 — Transport injection</H3>
            <P>The decrypted value is injected directly into the outbound HTTP request at the transport layer — as a Bearer token, custom header, query parameter, or one of the other five injection styles. The value is never returned as a string to the calling process.</P>

            <H3>Stage 4 — Domain allowlist check</H3>
            <P>Before forwarding the request, the proxy verifies the target domain is on the workspace allowlist. If it is not, the proxy returns 403 and logs the attempt. No credential is injected. This closes the SSRF and prompt injection exfiltration attack vectors.</P>

            <H3>Stage 5 — Response, redaction, and audit</H3>
            <P>The API response is returned. The proxy scans it for any pattern matching the injected credential value. If a match is found (a credential echo), it is replaced with [REDACTED_BY_AGENTSECRETS] before reaching your code. An audit entry is written: timestamp, key name, endpoint, status, latency. The value field does not exist in the audit schema.</P>

            <Callout icon="🔐">
              The structural guarantee: The proxy returns only the API response. The SDK has no get() method. The audit log has no value field. The mock testing client has no value field in call records. You cannot break this guarantee by misconfiguring something — the architecture gives the value nowhere to go.
            </Callout>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              KEYCHAIN
          ───────────────────────────────────────────────── */}
          <div id="doc-keychain" className="docs-section">
            <Breadcrumb items={["Core Concepts", "OS Keychain"]} />
            <H1>OS Keychain Storage</H1>
            <P>AgentSecrets stores all credentials in your operating system's native secure credential store — not in a file, not in a database, not in an environment variable.</P>

            <DocTable
              headers={["Platform", "Storage Backend", "Encryption"]}
              rows={[
                ["macOS", "macOS Keychain (Security framework)", "AES-256-GCM via Secure Enclave"],
                ["Linux", "libsecret / Secret Service API", "GNOME Keyring or KDE Wallet"],
                ["Windows", "Windows Credential Manager", "DPAPI (user-scoped)"],
              ]}
            />

            <Callout icon="💡">
              Keychain entries are scoped to your user account and cannot be read by other processes without your authentication. This is a fundamentally different security boundary than a .env file or an environment variable, which any process running as the same user can read.
            </Callout>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              ZERO KNOWLEDGE
          ───────────────────────────────────────────────── */}
          <div id="doc-zerok" className="docs-section">
            <Breadcrumb items={["Core Concepts", "Zero-Knowledge Design"]} />
            <H1>Zero-Knowledge Design</H1>
            <P>The cloud sync feature lets you share credentials across machines and teammates. It is designed so the server structurally cannot decrypt your secrets.</P>

            <H3>Encryption scheme</H3>
            <P>Before any secret leaves your machine, it is encrypted using X25519 key exchange (NaCl SealedBox), AES-256-GCM, and Argon2id key derivation. The encryption key lives only in your OS keychain. The server receives and stores only ciphertext.</P>

            <DocTable
              headers={["Layer", "Implementation"]}
              rows={[
                ["Key exchange", "X25519 (NaCl SealedBox)"],
                ["Secret encryption", "AES-256-GCM"],
                ["Key derivation", "Argon2id"],
                ["Key storage", "OS keychain"],
                ["Transport", "HTTPS / TLS"],
                ["Server storage", "Encrypted blobs only"],
              ]}
            />

            <H3>What the server sees</H3>
            <CodeWindow title="server-side storage (ciphertext only)" lines={[
              { t: "# Server stores:", c: "c-di" },
              { t: "{ id: 'entry_9xKp', project: 'my-agent',", c: "c-mu" },
              { t: "  key_name: 'STRIPE_KEY',", c: "c-mu" },
              { t: "  ciphertext: 'gAAAAABl7...EncryptedBlob...',", c: "c-mu" },
              { t: "  nonce: 'Zx9k...', tag: 'aB3c...' }", c: "c-mu" },
              { t: "", c: "" },
              { t: "# Server does NOT store:", c: "c-di" },
              { t: "# - The plaintext value", c: "c-re" },
              { t: "# - The decryption key", c: "c-re" },
              { t: "# - Any key derivation material", c: "c-re" },
            ]} />

            <H3>Policy vs. structure</H3>
            <P>A policy-based guarantee says we recommend not logging credential values. The system could log them. Whether it does depends on configuration and discipline. A structural guarantee says the log struct has no value field. The system cannot log a credential value regardless of configuration or intent. AgentSecrets makes the zero-knowledge guarantee structural at every layer.</P>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              ALLOWLIST
          ───────────────────────────────────────────────── */}
          <div id="doc-allowlist" className="docs-section">
            <Breadcrumb items={["Core Concepts", "Domain Allowlist"]} />
            <H1>Domain Allowlist</H1>
            <P>The proxy is deny-by-default. Before injecting any credential and forwarding any request, the proxy checks the target domain against the workspace allowlist. If the domain is not authorized, the proxy returns 403 and logs the attempt. No credential is injected. The request never reaches the upstream API.</P>

            <H3>What this closes</H3>
            <P><strong style={{ color: "var(--text)" }}>SSRF.</strong> If an attacker tricks your application into making a request to a server they control, the proxy blocks it before any credential is injected.</P>
            <P><strong style={{ color: "var(--text)" }}>Prompt injection exfiltration.</strong> If a malicious API response instructs your agent to send credentials to an attacker-controlled URL, the proxy blocks the outbound request.</P>
            <P><strong style={{ color: "var(--text)" }}>Misconfiguration.</strong> A tool that accidentally calls the wrong endpoint is blocked before any credential is exposed.</P>

            <H3>Managing the allowlist</H3>
            <CodeWindow title="allowlist commands" lines={[
              { t: "$ agentsecrets workspace allowlist add api.stripe.com", c: "c-em" },
              { t: "$ agentsecrets workspace allowlist add api.stripe.com api.openai.com api.github.com", c: "c-em" },
              { t: "$ agentsecrets workspace allowlist list", c: "c-sky" },
              { t: "$ agentsecrets workspace allowlist log", c: "c-mu" },
            ]} />

            <Callout warn icon="⚠️">
              Allowlist modifications require admin role and password verification. Non-admin team members cannot change what domains agents can reach.
            </Callout>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              REDACTION
          ───────────────────────────────────────────────── */}
          <div id="doc-redaction" className="docs-section">
            <Breadcrumb items={["Core Concepts", "Response Redaction"]} />
            <H1>Response Body Redaction</H1>
            <P>The proxy scans every API response for patterns matching the injected credential value. If a match is found, the proxy replaces it with [REDACTED_BY_AGENTSECRETS] before returning the response to your code.</P>
            <P>This defends against credential echo exfiltration — an attack where a compromised or malicious API reflects the credential back in its response, putting it into agent context where it can be read or logged.</P>

            <H3>What the audit log records</H3>
            <CodeWindow title="audit entry with credential echo" lines={[
              { t: "14:23:01  GET  api.stripe.com/v1/balance  STRIPE_KEY  bearer  200  credential_echo  245ms", c: "c-am" }
            ]} />

            <Callout icon="🔍">
              The redaction event is logged as credential_echo in the audit log. The value that was echoed is not logged — only the fact that an echo occurred, the key name, and the endpoint.
            </Callout>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              MCP
          ───────────────────────────────────────────────── */}
          <div id="doc-mcp" className="docs-section">
            <Breadcrumb items={["Integrations", "MCP / Claude Desktop"]} />
            <H1>MCP Integration <span style={{ fontSize: 12, fontWeight: 700, border: "1px solid rgba(0,255,135,0.4)", color: "var(--em)", background: "rgba(0,255,135,0.08)", padding: "2px 8px", borderRadius: 4, marginLeft: 8, verticalAlign: "middle" }}>Recommended</span></H1>
            <P>The MCP integration lets Claude Desktop and Cursor call any authenticated API through AgentSecrets. The agent asks for data using a key name. It never sees the credential.</P>

            <H3>Auto-install (recommended)</H3>
            <CodeWindow title="auto-configure Claude Desktop and Cursor" lines={[
              { t: "$ agentsecrets mcp install", c: "c-em" },
              { t: "  ✓ Detected Claude Desktop at ~/Library/Application Support/Claude", c: "c-mu" },
              { t: "  ✓ Written to claude_desktop_config.json", c: "c-mu" },
              { t: "  ✓ Restart Claude Desktop to activate", c: "c-mu" },
            ]} />

            <H3>Manual config</H3>
            <McpJsonWindow />

            <H3>Available MCP tools</H3>
            <DocTable
              headers={["Tool", "Description"]}
              rows={[
                ["api_call", "Make an authenticated HTTP request. Pass key name, URL, method, and optional body. Returns the API response. The value is never passed."],
                ["list_keys", "List available key names in the current project. Names only, never values."],
                ["check_status", "Returns current workspace, project, proxy status, and last sync time."],
              ]}
            />

            <Callout icon="💡">
              The MCP server exposes no tool that retrieves a credential value. list_keys returns names. api_call performs injection. There is no get_secret tool because there is no safe way to hand a value to an agent.
            </Callout>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              HTTP PROXY
          ───────────────────────────────────────────────── */}
          <div id="doc-proxy-int" className="docs-section">
            <Breadcrumb items={["Integrations", "HTTP Proxy"]} />
            <H1>HTTP Proxy Mode</H1>
            <P>Start a local HTTP proxy that any agent, script, or framework can route requests through. Send the key name in an injection header. AgentSecrets resolves the value and injects it before forwarding the request. Your code never held the value.</P>

            <CodeWindow title="proxy mode" lines={[
              { t: "$ agentsecrets proxy start --port 8765", c: "c-em" },
              { t: "", c: "" },
              { t: "# Route requests through the proxy", c: "c-di" },
              { t: "$ curl http://localhost:8765/proxy \\", c: "c-sky" },
              { t: '  -H "X-AS-Target-URL: https://api.stripe.com/v1/balance" \\', c: "c-sky" },
              { t: '  -H "X-AS-Inject-Bearer: STRIPE_KEY"', c: "c-am" },
            ]} />

            <H3>Injection headers reference</H3>
            <DocTable
              headers={["Header", "Injects", "Auth style"]}
              rows={[
                ["X-AS-Inject-Bearer: KEY_NAME", "Authorization: Bearer value", "OAuth / API tokens"],
                ["X-AS-Inject-Basic: KEY_NAME", "Authorization: Basic base64(v)", "HTTP Basic Auth"],
                ["X-AS-Inject-Header-X-Api-Key: KEY_NAME", "X-Api-Key: value", "Custom header"],
                ["X-AS-Inject-Query-key: KEY_NAME", "?key=value in URL", "Query param APIs"],
                ["X-AS-Inject-Body-path: KEY_NAME", '{"path": "value"} in JSON body', "Token exchange"],
                ["X-AS-Inject-Form-field: KEY_NAME", "field=value in form body", "OAuth form flows"],
              ]}
            />
            <P>The key name travels over localhost. The value never does.</P>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              PYTHON SDK
          ───────────────────────────────────────────────── */}
          <div id="doc-sdk-int" className="docs-section">
            <Breadcrumb items={["Integrations", "Python SDK"]} />
            <H1>Python SDK <span style={{ fontSize: 12, fontWeight: 700, border: "1px solid rgba(0,255,135,0.4)", color: "var(--em)", background: "rgba(0,255,135,0.08)", padding: "2px 8px", borderRadius: 4, marginLeft: 8, verticalAlign: "middle" }}>new</span></H1>

            <Callout icon="🔐">
              The SDK has no get() method. There is no retrieve(). The only way to use a credential is to make the call or spawn the process. The secure path is the only path.
            </Callout>

            <H3>Installation</H3>
            <CodeWindow title="" lines={[
              { t: "$ pip install agentsecrets", c: "c-em" },
            ]} />

            <H3>Initializing</H3>
            <CodeWindow title="" lines={[
              { t: "from agentsecrets import AgentSecrets", c: "c-sky" },
              { t: "", c: "" },
              { t: "client = AgentSecrets()", c: "c-wh" },
              { t: "client = AgentSecrets(port=9000)", c: "c-wh" },
              { t: 'client = AgentSecrets(workspace="Acme", project="payments")', c: "c-wh" },
              { t: "client = AgentSecrets(auto_start=False)", c: "c-wh" },
              { t: "", c: "" },
              { t: "# No credentials are passed into the constructor.", c: "c-di" }
            ]} />

            <H3>Making calls — client.call()</H3>
            <CodeWindow title="six injection styles" lines={[
              { t: "# Bearer token", c: "c-di" },
              { t: "response = client.call(", c: "c-wh" },
              { t: '    "https://api.stripe.com/v1/balance",', c: "c-vi" },
              { t: '    bearer="STRIPE_KEY"', c: "c-am" },
              { t: ")", c: "c-wh" },
              { t: "", c: "" },
              { t: "# Custom header", c: "c-di" },
              { t: "response = client.call(", c: "c-wh" },
              { t: '    "https://api.sendgrid.com/v3/mail/send",', c: "c-vi" },
              { t: '    method="POST", body=payload,', c: "c-wh" },
              { t: '    header={"X-Api-Key": "SENDGRID_KEY"}', c: "c-am" },
              { t: ")", c: "c-wh" },
              { t: "", c: "" },
              { t: "# Async variant", c: "c-di" },
              { t: "response = await client.async_call(", c: "c-sky" },
              { t: '    "https://api.openai.com/v1/models",', c: "c-vi" },
              { t: '    bearer="OPENAI_KEY"', c: "c-am" },
              { t: ")", c: "c-sky" },
            ]} />

            <H3>Spawning processes — client.spawn()</H3>
            <P>Inject secrets as environment variables into a child process at launch. The calling code never sees the values.</P>
            <CodeWindow title="" lines={[
              { t: 'result = client.spawn("stripe", ["mcp"])', c: "c-em" },
              { t: 'result = client.spawn("python", ["manage.py", "runserver"])', c: "c-em" },
              { t: 'proc   = client.spawn_async("stripe", ["mcp"])', c: "c-em" },
            ]} />

            <H3>Response object</H3>
            <DocTable
              headers={["Field", "Description"]}
              rows={[
                ["response.status_code", "HTTP status integer"],
                ["response.body", "Raw response string"],
                ["response.json()", "Parsed dict"],
                ["response.headers", "Response headers dict"],
                ["response.redacted", "True if proxy scrubbed a credential echo"],
                ["response.duration_ms", "Request duration in milliseconds"],
              ]}
            />
            <P>No field containing the credential value. Structural.</P>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              ENV COMMAND
          ───────────────────────────────────────────────── */}
          <div id="doc-env-int" className="docs-section">
            <Breadcrumb items={["Integrations", "agentsecrets env"]} />
            <H1>Environment Injection</H1>
            <P>agentsecrets env injects secrets as environment variables into a child process at launch. The calling process never sees the values. When the child process exits, they are gone.</P>
            <CodeWindow title="agentsecrets env" lines={[
              { t: "$ agentsecrets env -- python manage.py runserver", c: "c-em" },
              { t: "$ agentsecrets env -- stripe mcp", c: "c-em" },
              { t: "$ agentsecrets env -- node server.js", c: "c-em" },
              { t: "$ agentsecrets env -- npm run dev", c: "c-em" },
            ]} />
            <Callout warn icon="⚠️">
              Use this for tools and SDKs that read from environment variables rather than making direct HTTP calls. The credential value exists only inside the child process for its lifetime. This is not the full zero-knowledge guarantee — the subprocess holds the value in its environment — but it is significantly safer than a shared .env file or a hardcoded environment variable.
            </Callout>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              OPENCLAW
          ───────────────────────────────────────────────── */}
          <div id="doc-openclaw-i" className="docs-section">
            <Breadcrumb items={["Integrations", "OpenClaw"]} />
            <H1>OpenClaw Integration</H1>
            <P>AgentSecrets acts as an exec provider for OpenClaw. It reads a SecretRef from stdin, resolves the value from the OS keychain, and injects it. The calling OpenClaw skill never sees the credential value.</P>
            <CodeWindow title="openclaw install" lines={[
              { t: "$ openclaw skill install agentsecrets", c: "c-em" },
              { t: "", c: "" },
              { t: "# Or use the exec provider directly:", c: "c-di" },
              { t: "$ agentsecrets exec", c: "c-sky" },
              { t: "", c: "" },
              { t: "# Verify:", c: "c-di" },
              { t: "$ openclaw skill list | grep agentsecrets", c: "c-mu" },
              { t: "  agentsecrets  ✓ active", c: "c-em" },
            ]} />
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              CLI REFERENCE
          ───────────────────────────────────────────────── */}
          <div id="doc-cli-full" className="docs-section">
            <Breadcrumb items={["Reference", "CLI Reference"]} />
            <H1>CLI Reference</H1>
            <P>Every AgentSecrets command with full options and examples.</P>

            <H2>Account</H2>
            <H3>agentsecrets init</H3>
            <P>Create your account and generate encryption keys. Run once on a new machine.</P>
            <CodeWindow title="" lines={[{ t: "$ agentsecrets init", c: "c-em" }]} />

            <H3>agentsecrets login</H3>
            <P>Log in to an existing account.</P>
            <CodeWindow title="" lines={[{ t: "$ agentsecrets login", c: "c-em" }]} />

            <H3>agentsecrets logout</H3>
            <P>Clear your local session.</P>
            <CodeWindow title="" lines={[{ t: "$ agentsecrets logout", c: "c-em" }]} />

            <H3>agentsecrets status</H3>
            <P>Show current user, workspace, project, proxy status, and last sync time.</P>
            <CodeWindow title="" lines={[{ t: "$ agentsecrets status", c: "c-em" }]} />

            <H2>Workspaces</H2>
            <P>A workspace is a shared environment. Teammates join a workspace and get access to the projects inside it. Secrets are encrypted client-side before upload.</P>
            <H3>workspace create "Acme Engineering"</H3>
            <CodeWindow title="" lines={[{ t: '$ agentsecrets workspace create "Acme Engineering"', c: "c-em" }]} />
            <H3>workspace list</H3>
            <CodeWindow title="" lines={[{ t: "$ agentsecrets workspace list", c: "c-em" }]} />
            <H3>workspace switch "Acme Engineering"</H3>
            <CodeWindow title="" lines={[{ t: '$ agentsecrets workspace switch "Acme Engineering"', c: "c-em" }]} />
            <H3>workspace invite alice@acme.com</H3>
            <CodeWindow title="" lines={[{ t: "$ agentsecrets workspace invite alice@acme.com", c: "c-em" }]} />
            <H3>workspace promote alice@acme.com</H3>
            <P>Grant admin role. Admins can modify the domain allowlist and manage member roles.</P>
            <CodeWindow title="" lines={[{ t: "$ agentsecrets workspace promote alice@acme.com", c: "c-em" }]} />
            <H3>workspace demote alice@acme.com</H3>
            <CodeWindow title="" lines={[{ t: "$ agentsecrets workspace demote alice@acme.com", c: "c-em" }]} />
            <H3>workspace allowlist add api.stripe.com</H3>
            <P>Requires admin role and password verification.</P>
            <CodeWindow title="" lines={[{ t: "$ agentsecrets workspace allowlist add api.stripe.com", c: "c-em" }]} />
            <H3>workspace allowlist list</H3>
            <CodeWindow title="" lines={[{ t: "$ agentsecrets workspace allowlist list", c: "c-em" }]} />
            <H3>workspace allowlist log</H3>
            <P>View blocked and allowed request attempts.</P>
            <CodeWindow title="" lines={[{ t: "$ agentsecrets workspace allowlist log", c: "c-em" }]} />

            <H2>Projects</H2>
            <CodeWindow title="" lines={[
              { t: "$ agentsecrets project create", c: "c-em" },
              { t: "$ agentsecrets project list", c: "c-em" },
              { t: "$ agentsecrets project use", c: "c-em" },
              { t: "$ agentsecrets project delete", c: "c-em" },
            ]} />

            <H2>Secrets</H2>
            <CodeWindow title="" lines={[
              { t: "$ agentsecrets secrets set", c: "c-em" },
              { t: "$ agentsecrets secrets get", c: "c-em" },
              { t: "$ agentsecrets secrets list", c: "c-em" },
              { t: "$ agentsecrets secrets push", c: "c-em" },
              { t: "$ agentsecrets secrets pull", c: "c-em" },
              { t: "$ agentsecrets secrets diff", c: "c-em" },
              { t: "$ agentsecrets secrets delete", c: "c-em" },
            ]} />
            <CodeWindow title="example output" lines={[
              { t: "LOCAL ONLY:  PAYSTACK_KEY", c: "c-am" },
              { t: "REMOTE ONLY: SENDGRID_KEY", c: "c-am" },
              { t: "OUT OF SYNC: STRIPE_KEY (remote is newer)", c: "c-re" },
            ]} />

            <H2>Proxy</H2>
            <CodeWindow title="" lines={[
              { t: "$ agentsecrets proxy start", c: "c-em" },
              { t: "$ agentsecrets proxy stop", c: "c-em" },
              { t: "$ agentsecrets proxy status", c: "c-em" },
              { t: "$ agentsecrets proxy logs", c: "c-em" },
            ]} />
            <P>Every entry contains timestamps, key names, endpoints, and status codes. No value field.</P>

            <H2>Calls</H2>
            <H3>agentsecrets call</H3>
            <P>Make a one-shot authenticated API call through the proxy. Six injection styles.</P>
            <CodeWindow title="" lines={[
              { t: "$ agentsecrets call --url https://api.stripe.com/v1/balance --bearer STRIPE_KEY", c: "c-em" },
              { t: "$ agentsecrets call --url https://api.sendgrid.com --header X-Api-Key=KEY", c: "c-em" },
              { t: "$ agentsecrets call --url https://maps.googleapis.com --query key=GMAP_KEY", c: "c-em" },
              { t: "$ agentsecrets call --url https://api.jira.com --basic USER_KEY", c: "c-em" },
              { t: "$ agentsecrets call --url https://api.oauth.com --body-field path=KEY", c: "c-em" },
              { t: "$ agentsecrets call --url https://api.oauth.com --form-field field=KEY", c: "c-em" },
            ]} />

            <H2>Environment Injection</H2>
            <H3>agentsecrets env</H3>
            <CodeWindow title="" lines={[
              { t: "$ agentsecrets env -- python manage.py runserver", c: "c-em" },
            ]} />

            <H2>MCP</H2>
            <H3>agentsecrets mcp install</H3>
            <P>Auto-configure Claude Desktop and Cursor. Writes the MCP server config with no credential values.</P>
            <CodeWindow title="" lines={[{ t: "$ agentsecrets mcp install", c: "c-em" }]} />
            <H3>agentsecrets mcp serve</H3>
            <P>Start the MCP server. This is the command your MCP client calls. You do not run it directly.</P>
            <CodeWindow title="" lines={[{ t: "$ agentsecrets mcp serve", c: "c-em" }]} />

            <H2>OpenClaw</H2>
            <H3>agentsecrets exec</H3>
            <CodeWindow title="" lines={[{ t: "$ agentsecrets exec", c: "c-em" }]} />
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              SDK REFERENCE
          ───────────────────────────────────────────────── */}
          <div id="doc-sdk-ref" className="docs-section">
            <Breadcrumb items={["Reference", "SDK Reference"]} />
            <H1>SDK Reference</H1>
            <P>Build tools, MCP servers, and agent integrations on top of AgentSecrets infrastructure.</P>
            <Callout icon="🔐">
              The SDK has no get() method. There is no retrieve(). The only way to use a credential is to make the call or spawn the process. The secure path is the only path.
            </Callout>

            <H2>Management Layer</H2>
            <P>Full programmatic control of the credentials lifecycle. Every operation works with key names. No operation returns a credential value.</P>

            <H3>Status</H3>
            <CodeWindow title="" lines={[{ t: "status = client.proxy.status()", c: "c-wh" }]} />
            <H3>Secrets</H3>
            <CodeWindow title="" lines={[{ t: "client.secrets.list()\nclient.secrets.set('KEY', 'val')\nclient.secrets.push()", c: "c-wh" }]} />
            <H3>Workspaces</H3>
            <CodeWindow title="" lines={[{ t: "client.workspaces.list()\nclient.workspaces.create('Acme')", c: "c-wh" }]} />
            <H3>Projects</H3>
            <CodeWindow title="" lines={[{ t: "client.projects.list()\nclient.projects.create('my-app')", c: "c-wh" }]} />
            <H3>Domain Allowlist</H3>
            <CodeWindow title="" lines={[{ t: "client.allowlist.add('api.stripe.com')", c: "c-wh" }]} />
            <H3>Proxy and Audit Log</H3>
            <CodeWindow title="" lines={[{ t: "client.proxy.start()\nlogs = client.proxy.logs()", c: "c-wh" }]} />

            <H2>Error Handling</H2>
            <CodeWindow title="" lines={[
              { t: "try:", c: "c-sky" },
              { t: "    client.call('https://api.stripe.com', bearer='KEY')", c: "c-wh" },
              { t: "except agentsecrets.errors.AllowlistError:", c: "c-am" },
              { t: "    print('Domain blocked')", c: "c-wh" },
            ]} />
            <DocTable
              headers={["Exception", "Cause", "Fix"]}
              rows={[
                ["KeyNotFoundError", "Key missing from keychain", "agentsecrets secrets set"],
                ["AllowlistError", "Domain not approved", "agentsecrets workspace allowlist add"],
                ["ProxyConnectionError", "Proxy not running", "agentsecrets proxy start"],
                ["AuthFormatError", "Invalid auth params", "Check method signatures"],
                ["CloudSyncError", "Failed to sync remote", "Check connection"],
                ["ProjectContextError", "No project active", "agentsecrets project use"],
                ["RedactionTriggeredError", "Response threw credentials", "Review API integration"],
              ]}
            />

            <H2>Testing</H2>
            <P>Test without a running proxy and without real credentials.</P>
            <CodeWindow title="" lines={[
              { t: "from agentsecrets.testing import MockAgentSecrets", c: "c-sky" },
              { t: "client = MockAgentSecrets()", c: "c-wh" }
            ]} />
            <P>The zero-knowledge guarantee holds in test mode. Call records have no value field.</P>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              AUTH METHODS
          ───────────────────────────────────────────────── */}
          <div id="doc-auth-methods" className="docs-section">
            <Breadcrumb items={["Reference", "Auth Methods"]} />
            <H1>Auth Injection Methods</H1>
            <P>Six injection styles, selectable per call. All six give the same guarantee: the value is injected at the transport layer and never returned to the caller.</P>
            <DocTable
              headers={["CLI flag", "SDK param", "Injects as", "Use case"]}
              rows={[
                ["--bearer KEY_NAME", 'bearer="KEY_NAME"', "Authorization: Bearer value", "OAuth, Stripe, OpenAI"],
                ["--basic KEY_NAME", 'basic="KEY_NAME"', "Authorization: Basic base64(v)", "HTTP Basic Auth, Jira"],
                ["--header NAME=KEY_NAME", 'header={"X-Api-Key": "KEY_NAME"}', "X-Api-Key: value", "SendGrid, custom APIs"],
                ["--query param=KEY_NAME", 'query={"key": "KEY_NAME"}', "?key=value in URL", "Google APIs, legacy"],
                ["--body-field p=KEY_NAME", 'body_field={"path": "KEY_NAME"}', '{"path": "value"} in body', "Token exchange endpoints"],
                ["--form-field f=KEY_NAME", 'form_field={"field": "KEY_NAME"}', "field=value in form", "OAuth form flows"],
              ]}
            />
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              AUDIT LOG
          ───────────────────────────────────────────────── */}
          <div id="doc-audit" className="docs-section">
            <Breadcrumb items={["Reference", "Audit Log Schema"]} />
            <H1>Audit Log Schema</H1>
            <P>Every proxied request is logged. The log struct has no value field.</P>
            <CodeWindow title="log entry shape" lines={[
              { t: "timestamp | method | target_url | key_name | injection_style | status_code | duration_ms", c: "c-mu" }
            ]} />
            <CodeWindow title="~/.agentsecrets/audit.jsonl" lines={[
              { t: "{", c: "c-wh" },
              { t: '  "ts":              "2025-03-04T12:04:11.342Z",', c: "c-sky" },
              { t: '  "project":         "my-agent",', c: "c-sky" },
              { t: '  "key":             "STRIPE_KEY",', c: "c-am" },
              { t: '  "injection_style": "bearer",', c: "c-wh" },
              { t: '  "method":          "GET",', c: "c-wh" },
              { t: '  "url":             "https://api.stripe.com/v1/balance",', c: "c-wh" },
              { t: '  "status":          200,', c: "c-em" },
              { t: '  "ms":              143', c: "c-wh" },
              { t: "}", c: "c-wh" },
              { t: "", c: "" },
              { t: "# Note: no 'value' field. It does not exist in this schema.", c: "c-re" }
            ]} />

            <Callout icon="🔒">
              Why no value field? Omission is stronger than redaction. A redacted field can potentially be un-redacted. A field that was never written cannot be recovered, subpoenaed, or leaked. You can share logs, feed them to observability tooling, or give them to an agent to reason about without any credential exposure risk.
            </Callout>
            <P>When the proxy detects a credential echo in an API response, the audit entry gains an additional <C>injection_event</C> field with the value "credential_echo". The echoed value itself is never logged.</P>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              ARCHITECTURE
          ───────────────────────────────────────────────── */}
          <div id="doc-architecture" className="docs-section">
            <Breadcrumb items={["Reference", "Architecture"]} />
            <H1>Architecture</H1>
            <P>How AgentSecrets keeps credential values out of agent memory at every layer.</P>
            <P>The credential value should have nowhere to go except into the outbound HTTP request. Everything in the architecture follows from this.</P>

            <H2>The Proxy Model</H2>
            <CodeWindow title="proxy flow" lines={[
              { t: "Your code", c: "c-wh" },
              { t: "    sends key name to proxy", c: "c-mu" },
              { t: "    proxy resolves value from OS keychain", c: "c-am" },
              { t: "    proxy injects value into outbound request", c: "c-vi" },
              { t: "    upstream API responds", c: "c-sky" },
              { t: "    proxy returns API response to your code", c: "c-em" },
              { t: "", c: "" },
              { t: "# Your code never held the value.", c: "c-di" }
            ]} />

            <H2>Credential Storage</H2>
            <P>Credentials never hit the disk in plaintext.</P>
            <DocTable
              headers={["Platform", "Storage Backend"]}
              rows={[
                ["macOS", "macOS Keychain (Security framework)"],
                ["Linux", "libsecret / Secret Service API"],
                ["Windows", "Windows Credential Manager"],
              ]}
            />

            <H2>Encryption</H2>
            <DocTable
              headers={["Layer", "Implementation"]}
              rows={[
                ["Key exchange", "X25519 (NaCl SealedBox)"],
                ["Secret encryption", "AES-256-GCM"],
                ["Key derivation", "Argon2id"],
                ["Key storage", "OS keychain"],
                ["Transport", "HTTPS / TLS"],
                ["Server storage", "Encrypted blobs only"],
              ]}
            />

            <H2>Injection Headers</H2>
            <DocTable
              headers={["Style", "Header sent to proxy", "What proxy injects"]}
              rows={[
                ["Bearer token", "X-AS-Inject-Bearer", "Authorization: Bearer value"],
                ["HTTP Basic", "X-AS-Inject-Basic", "Authorization: Basic base64"],
                ["Custom Header", "X-AS-Inject-Header-Name", "Name: value"],
                ["Query Param", "X-AS-Inject-Query-key", "?key=value"],
                ["JSON Body", "X-AS-Inject-Body-path", "JSON mutation mapping value"],
                ["Form field", "X-AS-Inject-Form-field", "Form encoding field=value"],
              ]}
            />
            <P>The key name travels over localhost. The value never does.</P>

            <H2>The Domain Allowlist</H2>
            <P>AgentSecrets enforces a deny-by-default domain allowlist. This closes SSRF attacks, prompt injection exfiltration, and misconfiguration errors.</P>

            <H2>Response Body Redaction</H2>
            <P>Every response is scanned. If the exact value is echoed back, it is replaced stringently.</P>
            <CodeWindow title="credential echo" lines={[
              { t: "14:23:01  GET  api.example.com  KEY  bearer  200  credential_echo  245ms", c: "c-am" }
            ]} />

            <H2>The Audit Log</H2>
            <P>The log schema does not have a value field. Value omission is structurally enforced by Go struct definition.</P>

            <H2>The SDK Layer</H2>
            <P>Auth resolution order: 1. proxy, 2. env token, 3. raises error.</P>
            <P>The SDK accepts no credentials as constructor parameters. This is intentional.</P>

            <H2>The Structural Guarantee</H2>
            <P>A policy-based guarantee says we recommend not logging credential values. The system could log them. Whether it does depends on configuration and discipline. A structural guarantee says the log struct has no value field. The system cannot log a credential value regardless of configuration or intent. AgentSecrets makes the zero-knowledge guarantee structural at every layer.</P>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              SECURITY MODEL
          ───────────────────────────────────────────────── */}
          <div id="doc-security" className="docs-section">
            <Breadcrumb items={["Reference", "Security Model"]} />
            <H1>Security Model</H1>
            <P>AgentSecrets is designed around the principle of structural impossibility rather than policy enforcement. Each threat is mitigated architecturally.</P>
            <DocTable
              headers={["Threat", "Mitigation"]}
              rows={[
                ["Agent reads .env file", "No .env file — secrets in OS keychain only"],
                ["Agent logs credential in output", "Value never enters agent context — nothing to log"],
                ["Prompt injection exfiltration", "Domain allowlist blocks outbound requests to unknown domains"],
                ["Credential echo in API response", "Proxy scans responses and redacts matching patterns before return"],
                ["Malicious MCP skill intercepts", "Injection happens at transport, after the skill boundary"],
                ["Server-side breach", "Server holds AES-256-GCM ciphertext — undecryptable without keychain key"],
                ["Memory scraping", "Decrypted value held in memory for under 1ms, then cleared"],
                ["Audit log leak", "Value field does not exist in schema — cannot be present"],
                ["Replay attack", "Each call uses a fresh nonce; TLS session prevents replay"],
                ["SSRF", "Domain allowlist enforced before any credential is injected"],
              ]}
            />
            <Callout warn icon="⚠️">
              Responsible disclosure: Please report security vulnerabilities to hello@theseventeen.co — do not open public GitHub issues for security findings.
            </Callout>
          </div>
          <Divider />

          {/* ─────────────────────────────────────────────────
              PRICING
          ───────────────────────────────────────────────── */}
          <div id="doc-pricing" className="docs-section">
            <Breadcrumb items={["Reference", "Pricing"]} />
            <H1>Free and open source.</H1>
            <P>No tiers. No usage limits. No vendor lock-in.</P>
            <P>AgentSecrets is MIT licensed. The CLI, the proxy, the SDK, and the MCP template are all open source. Fork them, modify them, self-host them. The cloud sync feature — encrypted secret backup and team sharing — runs on AgentSecrets servers and is free.</P>

            <H2>What is free</H2>
            <DocTable
              headers={["Feature", "Status"]}
              rows={[
                ["CLI and local proxy", "Free, open source"],
                ["OS keychain storage", "Free, open source"],
                ["Six auth injection styles", "Free, open source"],
                ["Domain allowlist enforcement", "Free, open source"],
                ["Response body redaction", "Free, open source"],
                ["MCP server integration", "Free, open source"],
                ["OpenClaw integration", "Free, open source"],
                ["Team workspaces", "Free"],
                ["Cloud sync (encrypted)", "Free"],
                ["Audit logging", "Free"],
                ["Python SDK", "Free, open source"],
                ["Zero-Knowledge MCP template", "Free, open source"],
              ]}
            />

            <H2>Source code</H2>
            <DocTable
              headers={["Repository", "What it is"]}
              rows={[
                ["agentsecrets", "CLI and proxy, written in Go"],
                ["agentsecrets-sdk", "Python SDK"],
                ["zero-knowledge-mcp", "MCP server template"],
              ]}
            />
            <P>MIT License on all three.</P>

            <H2>Self-hosting</H2>
            <P>The local proxy runs entirely on your machine. Your credentials never leave your OS keychain unless you explicitly push them to cloud sync. If you choose not to use cloud sync, AgentSecrets works fully offline.</P>

            <H2>What comes next</H2>
            <P>Two features on the roadmap will have pricing when they ship.</P>
            <P><strong style={{ color: "var(--text)" }}>Cloud Resolver.</strong> Credential injection for serverless and cloud environments where a persistent local proxy cannot run. Lambda, Vercel, Cloudflare Workers. Pricing will be usage-based.</P>
            <P><strong style={{ color: "var(--text)" }}>AgentSecrets Connect.</strong> Multi-tenant credential delegation for platforms. Lets products provision AgentSecrets workspaces for their users during onboarding. Pricing will be usage-based.</P>
            <P>Everything that exists today remains free when they ship.</P>

            <CodeWindow title="get started" lines={[
              { t: "$ brew install The-17/tap/agentsecrets", c: "c-em" },
              { t: "$ agentsecrets init", c: "c-sky" },
            ]} />
          </div>

          {/* Bottom padding so last section isn't flush against viewport edge */}
          <div style={{ height: 80 }} />
        </main>
      </div>
    </>
  );
}