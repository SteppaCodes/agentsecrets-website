"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeWindow, McpJsonWindow } from "./ui/code-window";

const TABS = [
  {
    id: "mcp",
    label: "MCP / Claude",
    content: null,
  },
  {
    id: "proxy",
    label: "HTTP Proxy",
    lines: [
      { t: "# Start zero-knowledge local proxy", c: "c-di" },
      { t: "$ agentsecrets proxy start --port 8765", c: "c-em" },
      { t: "  ✓ Listening on localhost:8765", c: "c-mu" },
      { t: "", c: "" },
      { t: "# Agent routes request through proxy", c: "c-di" },
      { t: "$ curl http://localhost:8765/proxy \\", c: "c-sky" },
      { t: '  -H "X-AS-Target-URL: https://api.stripe.com/v1/balance" \\', c: "c-sky" },
      { t: '  -H "X-AS-Inject-Bearer: STRIPE_KEY"', c: "c-am" },
      { t: "", c: "" },
      { t: "# Works with LangChain, CrewAI, AutoGen, any HTTP client.", c: "c-di" },
    ],
  },
  {
    id: "cli",
    label: "CLI Direct",
    lines: [
      { t: "# One-time setup", c: "c-di" },
      { t: "$ agentsecrets init && agentsecrets project create my-project", c: "c-em" },
      { t: "", c: "" },
      { t: "# Store — encrypted to OS keychain", c: "c-di" },
      { t: "$ agentsecrets secrets set STRIPE_KEY=sk_live_...", c: "c-am" },
      { t: "", c: "" },
      { t: "# Authenticated call — pass key NAME, value injected internally", c: "c-di" },
      { t: "$ agentsecrets call \\", c: "c-sky" },
      { t: "    --url https://api.stripe.com/v1/balance \\", c: "c-sky" },
      { t: "    --bearer STRIPE_KEY", c: "c-sky" },
    ],
  },
  {
    id: "env",
    label: "Env Injection",
    lines: [
      { t: "# Wrap any command — secrets injected as env vars", c: "c-di" },
      { t: "$ agentsecrets env -- stripe mcp", c: "c-em" },
      { t: "$ agentsecrets env -- node server.js", c: "c-em" },
      { t: "$ agentsecrets env -- npm run dev", c: "c-em" },
      { t: "", c: "" },
      { t: "# Values exist only in the child process memory.", c: "c-di" },
      { t: "# Nothing is written to disk or shell history.", c: "c-di" },
      { t: "", c: "" },
      { t: "# Claude Desktop (wrapping native Stripe MCP):", c: "c-di" },
      { t: '# "command": "agentsecrets", "args": ["env", "--", "stripe", "mcp"]', c: "c-mu" },
    ],
  },
  {
    id: "openclaw",
    label: "OpenClaw",
    lines: [
      { t: "# Install via ClawHub", c: "c-di" },
      { t: "$ openclaw skill install agentsecrets", c: "c-em" },
      { t: "", c: "" },
      { t: "# Or manual install:", c: "c-di" },
      { t: "$ cp -r integrations/openclaw ~/.openclaw/skills/agentsecrets", c: "c-sky" },
      { t: "", c: "" },
      { t: "# Also ships as a native exec provider for OpenClaw's SecretRef.", c: "c-di" },
      { t: "# Agent manages full secrets workflow autonomously within OpenClaw.", c: "c-em" },
    ],
  },
];

export default function Integrations() {
  const [active, setActive] = useState("mcp");
  const tab = TABS.find((t) => t.id === active)!;

  return (
    <div id="integrations" className="rv" style={{ marginTop: 52 }}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 18, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => setActive(t.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontSize: 11,
              padding: "7px 14px",
              borderRadius: 7,
              border: `1px solid ${active === t.id ? "var(--border-em)" : "var(--border)"}`,
              color: active === t.id ? "var(--em)" : "var(--muted)",
              background: active === t.id ? "rgba(0,255,135,0.06)" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
              fontWeight: active === t.id ? 700 : 400,
              position: "relative",
            }}
          >
            {active === t.id && (
              <motion.div
                layoutId="tab-indicator"
                style={{
                  position: "absolute",
                  inset: -1,
                  borderRadius: 7,
                  border: "1px solid var(--border-em)",
                  background: "rgba(0,255,135,0.06)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>{t.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Content with animated swap */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {active === "mcp" ? (
            <McpJsonWindow />
          ) : (
            <CodeWindow
              title={`agentsecrets · ${tab.label?.toLowerCase()}`}
              lines={tab.lines || []}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
