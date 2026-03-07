"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeWindow } from "./ui/code-window";

const INSTALLERS = [
  { l: "brew", c: "$ brew install The-17/tap/agentsecrets" },
  { l: "npm",  c: "$ npm install -g @the-17/agentsecrets" },
  { l: "pip",  c: "$ pip install agentsecrets-cli" },
  { l: "go",   c: "$ go install github.com/The-17/agentsecrets/cmd/agentsecrets@latest" },
];

export default function InstallSection() {
  const [active, setActive] = useState("brew");
  const cmd = INSTALLERS.find((i) => i.l === active)!.c;

  return (
    <div id="install" className="rv" style={{ marginTop: 52 }}>
      {/* Switcher tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14, justifyContent: "center", flexWrap: "wrap" }}>
        {INSTALLERS.map((inst) => (
          <motion.button
            key={inst.l}
            onClick={() => setActive(inst.l)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: 6,
              border: `1px solid ${active === inst.l ? "var(--border-em)" : "var(--border)"}`,
              color: active === inst.l ? "var(--em)" : "var(--muted)",
              background: active === inst.l ? "rgba(0,255,135,0.06)" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            {inst.l}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          <CodeWindow
            title={`install via ${active}`}
            lines={[
              { t: cmd,                                                                     c: "c-em" },
              { t: "",                                                                      c: "" },
              { t: "$ agentsecrets init",                                                   c: "c-sky" },
              { t: "$ agentsecrets project create my-agent",                                c: "c-sky" },
              { t: "$ agentsecrets secrets set STRIPE_KEY=sk_live_...",                     c: "c-am" },
              { t: "$ agentsecrets workspace allowlist add api.stripe.com",                 c: "c-mu" },
              { t: "$ agentsecrets proxy start",                                            c: "c-sky" },
              { t: "$ agentsecrets call --url https://api.stripe.com/v1/balance --bearer STRIPE_KEY", c: "c-em" },
              { t: "",                                                                      c: "" },
              { t: '  → {"available":[{"amount":24350,"currency":"usd"}]}',                c: "c-mu" },
              { t: "  → STRIPE_KEY value: never in agent context ✓",                       c: "c-em" }
            ]}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
