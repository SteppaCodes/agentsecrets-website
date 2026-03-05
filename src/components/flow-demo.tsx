"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { label: "AI Agent\nRequest", sub: "key name only", icon: "🤖", warn: false },
  { label: "OS Keychain\nLookup", sub: "secure OS store", icon: "🔐", warn: true },
  { label: "Transport\nInjection", sub: "value never exposed", icon: "⚡", warn: false },
  { label: "API\nCall", sub: "HTTP w/ real bearer", icon: "🌐", warn: false },
  { label: "Response\nReturned", sub: "key never in scope", icon: "✅", warn: false },
];

const TLINES = [
  [
    { t: "# Agent requests Stripe balance — passes KEY NAME, not value", c: "c-di" },
    { t: "agentsecrets call \\", c: "c-em", d: true },
    { t: "    --url https://api.stripe.com/v1/balance \\", c: "c-em" },
    { t: "    --bearer STRIPE_KEY", c: "c-em", p: 400 },
  ],
  [
    { t: "", c: "" },
    { t: "  → Keychain lookup: STRIPE_KEY", c: "c-am" },
    { t: "  → Fingerprint matched: 9A2F:4C18:••••", c: "c-am" },
    { t: "  → AES-256-GCM decrypt (in-process only)...", c: "c-am" },
    { t: "  → Value available in-process memory only", c: "c-am", p: 520 },
  ],
  [
    { t: "", c: "" },
    { t: "  → Building Authorization header...", c: "c-vi" },
    { t: "  → Bearer: [INJECTED DIRECTLY AT HTTP TRANSPORT]", c: "c-vi" },
    { t: "  ⚡ Key value NEVER written to agent context or logs", c: "c-vi", p: 450 },
  ],
  [
    { t: "", c: "" },
    { t: "  → POST https://api.stripe.com/v1/balance  (TLS 1.3)", c: "c-sky" },
    { t: "  → 200 OK · 143ms", c: "c-sky", p: 380 },
  ],
  [
    { t: "", c: "" },
    { t: '  ✓ {"object":"balance","available":[{"amount":24350}]}', c: "c-em" },
    { t: "  ✓ Audit entry: key=STRIPE_KEY · value=STRUCTURALLY ABSENT", c: "c-em" },
    { t: "  ✓ In-process memory cleared. Agent never saw sk_live_...", c: "c-em" },
  ],
];

interface PrintedLine {
  text: string;
  cls: string;
  d?: boolean;
}

export default function FlowDemo() {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const [packet, setPacket] = useState(-1);
  const [printed, setPrinted] = useState<PrintedLine[]>([]);
  const [typing, setTyping] = useState<(PrintedLine & { caret?: boolean }) | null>(null);
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sRef = useRef({ step: -1, li: 0, ci: 0, phase: "idle" });

  const clear = () => {
    if (tRef.current) clearTimeout(tRef.current);
    setPhase("idle");
    setActiveStep(-1);
    setDoneSteps([]);
    setPacket(-1);
    setPrinted([]);
    setTyping(null);
    sRef.current = { step: -1, li: 0, ci: 0, phase: "idle" };
  };

  const next = useCallback(() => {
    const s = sRef.current;
    if (s.phase !== "running") return;
    const lines = TLINES[s.step];
    if (!lines) return;
    const line = lines[s.li];
    if (!line) return;

    if (s.ci < line.t.length) {
      s.ci++;
      setTyping({ text: line.t.slice(0, s.ci), cls: line.c, d: line.d, caret: true });
      tRef.current = setTimeout(next, 11);
      return;
    }

    setPrinted((p) => [...p, { text: line.t, cls: line.c, d: line.d }]);
    setTyping(null);
    s.li++;
    s.ci = 0;

    if (s.li < lines.length) {
      tRef.current = setTimeout(next, (line as { p?: number }).p || 65);
      return;
    }

    tRef.current = setTimeout(() => {
      if (sRef.current.phase !== "running") return;
      const cs = s.step;
      setPacket(cs);
      tRef.current = setTimeout(() => {
        if (sRef.current.phase !== "running") return;
        setPacket(-1);
        setDoneSteps((d) => [...d, cs]);
        const ns = cs + 1;
        if (ns < STEPS.length) {
          s.step = ns;
          s.li = 0;
          s.ci = 0;
          setActiveStep(ns);
          tRef.current = setTimeout(next, 280);
        } else {
          s.phase = "done";
          setPhase("done");
          setActiveStep(-1);
        }
      }, 700);
    }, 600);
  }, []);

  const run = useCallback(() => {
    clear();
    tRef.current = setTimeout(() => {
      sRef.current = { step: 0, li: 0, ci: 0, phase: "running" };
      setPhase("running");
      setActiveStep(0);
      next();
    }, 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next]);

  useEffect(() => () => { if (tRef.current) clearTimeout(tRef.current); }, []);

  const ringVariants = (i: number) => {
    const isDone = doneSteps.includes(i);
    const isActive = i === activeStep;
    const isWarn = STEPS[i].warn;
    return {
      scale: isActive ? 1.14 : 1,
      borderColor: isDone ? "#00cc6a" : isActive ? (isWarn ? "#ffb800" : "#00ff87") : "rgba(255,255,255,0.07)",
      backgroundColor: isDone
        ? "rgba(0,204,106,0.15)"
        : isActive
        ? isWarn
          ? "rgba(255,184,0,0.1)"
          : "rgba(0,255,135,0.1)"
        : "rgba(255,255,255,0.02)",
      boxShadow: isDone
        ? "none"
        : isActive
        ? isWarn
          ? "0 0 0 9px rgba(255,184,0,0.06), 0 0 28px rgba(255,184,0,0.18)"
          : "0 0 0 9px rgba(0,255,135,0.07), 0 0 32px rgba(0,255,135,0.2)"
        : "none",
    };
  };

  const labelColor = (i: number) =>
    doneSteps.includes(i) ? "var(--em)" : i === activeStep ? (STEPS[i].warn ? "var(--am)" : "var(--em)") : "var(--muted)";

  const connColor = (i: number) =>
    doneSteps.includes(i) ? "var(--em2)" : i === activeStep ? "rgba(0,255,135,0.2)" : "rgba(255,255,255,0.05)";

  return (
    <div id="how-it-works" className="rv" style={{
      border: "1px solid var(--border-em)",
      borderRadius: 16,
      background: "var(--code-bg)",
      overflow: "hidden",
      marginTop: 48,
      boxShadow: "0 0 80px rgba(0,255,135,0.04),0 40px 80px rgba(0,0,0,0.5)",
    }}>
      {/* Title bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "13px 20px", borderBottom: "1px solid var(--border)",
        background: "rgba(0,255,135,0.02)",
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
        </div>
        <span style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.04em" }}>
          agentsecrets · security protocol · live walkthrough
        </span>
        <motion.button
          whileHover={phase !== "running" ? { borderColor: "var(--em)", background: "rgba(0,255,135,0.08)" } : {}}
          whileTap={phase !== "running" ? { scale: 0.95 } : {}}
          onClick={phase === "running" ? undefined : phase !== "idle" ? clear : run}
          disabled={phase === "running"}
          style={{
            fontSize: 11, fontWeight: 700, padding: "6px 16px", borderRadius: 6,
            border: `1px solid ${phase === "running" ? "var(--muted)" : "var(--em)"}`,
            color: phase === "running" ? "var(--muted)" : "var(--em)",
            background: "transparent", cursor: phase === "running" ? "not-allowed" : "pointer",
            transition: "all 0.2s", fontFamily: "inherit",
          }}
        >
          {phase === "running" ? "● running..." : phase !== "idle" ? "↺ reset" : "▶ run demo"}
        </motion.button>
      </div>

      {/* Flow track */}
      <div style={{
        display: "flex", alignItems: "center", padding: "28px 36px",
        borderBottom: "1px solid var(--border)", overflowX: "auto",
      }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, flexShrink: 0 }}>
              <motion.div
                animate={ringVariants(i)}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                style={{
                  width: 50, height: 50, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, border: "2px solid rgba(255,255,255,0.07)",
                }}
              >
                {doneSteps.includes(i) ? "✓" : s.icon}
              </motion.div>
              <motion.div
                animate={{ color: labelColor(i), fontWeight: i === activeStep ? 700 : 400 }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: 10, textAlign: "center", maxWidth: 70, lineHeight: 1.4, whiteSpace: "pre-line" }}
              >
                {s.label}
              </motion.div>
              <div style={{ fontSize: 9, color: "var(--muted)", textAlign: "center", maxWidth: 70 }}>
                {s.sub}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <motion.div
                animate={{ backgroundColor: connColor(i) }}
                transition={{ duration: 0.5 }}
                style={{ flex: 1, height: 2, minWidth: 16, position: "relative", overflow: "visible" }}
              >
                <AnimatePresence>
                  {packet === i && (
                    <motion.div
                      initial={{ left: -5 }}
                      animate={{ left: "calc(100% + 5px)" }}
                      transition={{ duration: 0.75, ease: "linear" }}
                      style={{
                        position: "absolute", top: "50%", transform: "translateY(-50%)",
                        width: 9, height: 9, borderRadius: "50%",
                        background: i === 1 ? "var(--am)" : "var(--em)",
                        boxShadow: `0 0 10px ${i === 1 ? "var(--am)" : "var(--em)"}`,
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Terminal */}
      <div style={{
        padding: "24px 28px", minHeight: 220,
        background: "linear-gradient(180deg,var(--code-bg) 0%,rgba(3,5,10,0.98) 100%)",
      }}>
        <AnimatePresence mode="wait">
          {phase === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", height: 200, gap: 12,
              }}
            >
              <div style={{ fontSize: 34 }}>🔐</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                Click{" "}
                <span style={{ color: "var(--em)", fontWeight: 700 }}>▶ run demo</span>{" "}
                to watch the zero-knowledge protocol execute
              </div>
            </motion.div>
          ) : (
            <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {printed.map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`tline ${l.cls}`}
                  style={{ fontSize: 12, lineHeight: "2.1" }}
                >
                  {l.d && <span style={{ color: "#fff", marginRight: 5 }}>$</span>}
                  {l.text}
                </motion.div>
              ))}
              {typing && (
                <div className={`tline ${typing.cls}`} style={{ fontSize: 12, lineHeight: "2.1" }}>
                  {typing.d && <span style={{ color: "#fff", marginRight: 5 }}>$</span>}
                  {typing.text}
                  <span style={{ animation: "blink 1s step-end infinite" }}>▌</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info row */}
      <div style={{
        borderTop: "1px solid var(--border)",
        display: "grid", gridTemplateColumns: "repeat(3,1fr)",
        background: "rgba(0,255,135,0.015)",
      }}>
        {[
          {
            label: "Protocol Status",
            val: phase === "idle" ? "IDLE" : phase === "running" ? "EXECUTING" : "COMPLETE ✓",
            color: phase === "idle" ? "var(--muted)" : phase === "running" ? "var(--am)" : "var(--em)",
          },
          { label: "Key value in agent memory", val: "NEVER", color: "var(--re)" },
          { label: "Encryption", val: "X25519 + AES-256-GCM", color: "var(--em)" },
        ].map(({ label, val, color }, i) => (
          <div key={label} style={{ padding: "14px 24px", borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
              {label}
            </div>
            <motion.div
              animate={{ color }}
              transition={{ duration: 0.4 }}
              style={{ fontSize: 12, fontWeight: 700 }}
            >
              {val}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
