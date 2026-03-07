"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeWindow, McpJsonWindow } from "./ui/code-window";

const TABS = [
  {
    id: "mcp",
    label: "MCP / Claude Desktop",
    content: null,
  },
  {
    id: "sdk",
    label: "Python SDK",
    lines: [
      { t: "$ pip install agentsecrets",           c: "c-em" },
      { t: "",                                     c: "" },
      { t: "from agentsecrets import AgentSecrets",c: "c-sky" },
      { t: "",                                     c: "" },
      { t: "client = AgentSecrets()",              c: "c-wh" },
      { t: "",                                     c: "" },
      { t: "# Bearer token",                       c: "c-di" },
      { t: "response = client.call(",              c: "c-wh" },
      { t: '    "https://api.stripe.com/v1/balance",', c: "c-vi" },
      { t: '    bearer="STRIPE_KEY"',              c: "c-am" },
      { t: ")",                                    c: "c-wh" },
      { t: "",                                     c: "" },
      { t: "# No .get(). No .retrieve().",         c: "c-di" },
      { t: "# The secure path is the only path.",  c: "c-em" }
    ],
  },
  {
    id: "proxy",
    label: "HTTP Proxy",
    lines: [
      { t: "$ agentsecrets proxy start --port 8765",            c: "c-em" },
      { t: "  ✓ Listening on localhost:8765",                   c: "c-mu" },
      { t: "",                                                   c: "" },
      { t: "# Route any agent through the proxy",               c: "c-di" },
      { t: "$ curl http://localhost:8765/proxy \\",              c: "c-sky" },
      { t: '  -H "X-AS-Target-URL: https://api.stripe.com/v1/balance" \\', c: "c-sky" },
      { t: '  -H "X-AS-Inject-Bearer: STRIPE_KEY"',             c: "c-am" },
      { t: "",                                                   c: "" },
      { t: "# 6 injection styles available:",                   c: "c-di" },
      { t: "# X-AS-Inject-Bearer   X-AS-Inject-Basic",          c: "c-mu" },
      { t: "# X-AS-Inject-Header-X-Api-Key   X-AS-Inject-Query-key", c: "c-mu" },
      { t: "# X-AS-Inject-Body-path   X-AS-Inject-Form-field",  c: "c-mu" }
    ],
  },
  {
    id: "openclaw",
    label: "OpenClaw",
    lines: [
      { t: "$ openclaw skill install agentsecrets",             c: "c-em" },
      { t: "",                                                   c: "" },
      { t: "# Or the exec provider directly:",                  c: "c-di" },
      { t: "$ agentsecrets exec",                               c: "c-sky" },
      { t: "",                                                   c: "" },
      { t: "# agentsecrets reads SecretRef from stdin,",        c: "c-di" },
      { t: "# resolves the value, injects it.",                 c: "c-di" },
      { t: "# The calling OpenClaw skill never sees the value.", c: "c-em" }
    ],
  },
  {
    id: "env",
    label: "agentsecrets env",
    lines: [
      { t: "# Inject secrets into any child process at launch", c: "c-di" },
      { t: "$ agentsecrets env -- python manage.py runserver",  c: "c-em" },
      { t: "$ agentsecrets env -- stripe mcp",                  c: "c-em" },
      { t: "$ agentsecrets env -- node server.js",              c: "c-em" },
      { t: "$ agentsecrets env -- npm run dev",                 c: "c-em" },
      { t: "",                                                   c: "" },
      { t: "# Values exist only inside the child process.",     c: "c-di" },
      { t: "# When the process exits, they are gone.",          c: "c-mu" },
      { t: "# The parent process never holds a value.",         c: "c-mu" }
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
