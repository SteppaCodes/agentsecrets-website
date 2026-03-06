"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const APIS = [
  {
    key: "STRIPE_KEY",
    ep: "api.stripe.com/v1/balance",
    method: "GET",
    label: "Check Stripe balance",
    realVal: "sk_live_51HxQ...Kp3z",
    resp: '{"available":[{"amount":24350,"currency":"usd"}]}',
    ms: 143,
  },
  {
    key: "OPENAI_KEY",
    ep: "api.openai.com/v1/embeddings",
    method: "POST",
    label: "Generate embedding",
    realVal: "sk-proj-T4mX...Nz91",
    resp: '{"object":"list","data":[{"embedding":[0.0023,...]}]}',
    ms: 412,
  },
  {
    key: "GITHUB_TOKEN",
    ep: "api.github.com/repos/my/repo",
    method: "GET",
    label: "Read GitHub repo",
    realVal: "ghp_Rd7K...wQ2p",
    resp: '{"name":"my-repo","private":true,"stargazers":14}',
    ms: 231,
  },
  {
    key: "SLACK_TOKEN",
    ep: "slack.com/api/chat.postMessage",
    method: "POST",
    label: "Send Slack message",
    realVal: "xoxb-912...Mn4k",
    resp: '{"ok":true,"ts":"1709123456.000100"}',
    ms: 318,
  },
];

interface ApiCall {
  id: number;
  api: (typeof APIS)[0];
  agentPhase: "requesting" | "done";
  realPhase: "injecting" | "done";
  showReal: boolean;
}

interface LogRow {
  id: number;
  api: (typeof APIS)[0];
  ts: string;
  isNew: boolean;
}

export default function SecretTheater() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [intercepting, setIntercepting] = useState(false);
  const [calls, setCalls] = useState<ApiCall[]>([]);
  const [logRows, setLogRows] = useState<LogRow[]>([]);
  const [leakCount] = useState(0);
  const [activeCallId, setActiveCallId] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const at = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(false);
    setDone(false);
    setIntercepting(false);
    setCalls([]);
    setLogRows([]);
    setActiveCallId(null);
  };

  const runTheater = () => {
    reset();
    setRunning(true);

    APIS.forEach((api, i) => {
      const d = i * 3400;

      // 1 — agent sends key name
      at(() => {
        setActiveCallId(i);
        setCalls((r) => [
          ...r,
          { id: i, api, agentPhase: "requesting", realPhase: "injecting", showReal: false },
        ]);
      }, d);

      // 2 — interceptor activates
      at(() => setIntercepting(true), d + 420);

      // 3 — real side shows (key resolved in keychain)
      at(() => {
        setCalls((r) => r.map((c) => (c.id === i ? { ...c, showReal: true } : c)));
        setIntercepting(false);
      }, d + 950);

      // 4 — both sides done, agent gets response (not the secret)
      at(() => {
        setCalls((r) =>
          r.map((c) =>
            c.id === i ? { ...c, agentPhase: "done", realPhase: "done" } : c
          )
        );
        const ts = new Date().toTimeString().slice(0, 8);
        setLogRows((r) => [{ id: i, api, ts, isNew: true }, ...r]);
        setTimeout(
          () => setLogRows((r) => r.map((row) => (row.id === i ? { ...row, isNew: false } : row))),
          600
        );
      }, d + 1900);

      if (i === APIS.length - 1) {
        at(() => {
          setRunning(false);
          setDone(true);
          setActiveCallId(null);
        }, d + 2600);
      }
    });
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <div className="rv" style={{ marginTop: 56 }}>
      {/* ── Header row ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              color: "var(--em)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Secret Interception — Live
          </div>
          <div
            style={{
              fontSize: "clamp(20px,2.5vw,32px)",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              lineHeight: 1.15,
              marginBottom: 10,
            }}
          >
            The agent calls APIs.
            <br />
            <span style={{ color: "var(--em)" }}>It never touches the key.</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 2, maxWidth: 500 }}>
            Watch 4 real API calls fire. The left pane is exactly what the agent sees — a key{" "}
            <span style={{ color: "var(--em)", fontStyle: "normal" }}>name</span>, never the value.
            The right pane is what actually happens in the transport layer. The two panes prove the
            guarantee: secrets never cross the agent boundary.
          </p>
        </div>
        <button
          onClick={running ? undefined : done ? reset : runTheater}
          disabled={running}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            fontWeight: 700,
            padding: "11px 24px",
            borderRadius: 8,
            border: "1px solid var(--em)",
            color: "var(--em)",
            background: "rgba(0,255,135,0.06)",
            cursor: running ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            fontFamily: "inherit",
            opacity: running ? 0.6 : 1,
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (!running) (e.currentTarget as HTMLElement).style.background = "rgba(0,255,135,0.14)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(0,255,135,0.06)";
          }}
        >
          {running ? "⏳ intercepting..." : done ? "↺ run again" : "▶ simulate 4 API calls"}
        </button>
      </div>

      {/* ── ZERO counter ── */}
      <AnimatePresence>
        {(running || done) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
              padding: "10px 20px",
              background: "rgba(0,255,135,0.04)",
              border: "1px solid var(--border-em)",
              borderRadius: 10,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              Secrets exposed to agent
            </span>
            <motion.span
              key={leakCount}
              initial={{ scale: 1.4, color: "#00ff87" }}
              animate={{ scale: 1 }}
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "var(--em)",
                letterSpacing: -1,
                lineHeight: 1,
              }}
            >
              {leakCount}
            </motion.span>
            <span style={{ fontSize: 11, color: "var(--em)" }}>
              — zero now, zero always, by design
            </span>
            <div style={{ flex: 1 }} />
            <span
              style={{
                fontSize: 10,
                color: calls.length > 0 ? "var(--em)" : "var(--muted)",
                border: "1px solid var(--border-em)",
                padding: "3px 10px",
                borderRadius: 4,
                letterSpacing: "0.06em",
              }}
            >
              {calls.length} / {APIS.length} API calls intercepted
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Split pane ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 60px 1fr",
          border: "1px solid var(--border-em)",
          borderRadius: 16,
          overflow: "hidden",
          background: "var(--code-bg)",
          boxShadow: "0 0 60px rgba(0,255,135,0.05)",
        }}
      >
        {/* LEFT: what agent sees */}
        <div>
          {/* pane header */}
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid rgba(255,59,92,0.2)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,59,92,0.05)",
            }}
          >
            <span style={{ fontSize: 18 }}>🤖</span>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fca5a5",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Agent&apos;s View
              </div>
              <div style={{ fontSize: 10, color: "var(--muted)" }}>
                Everything the AI model can read
              </div>
            </div>
            {/* legend pill */}
            <div
              style={{
                marginLeft: "auto",
                fontSize: 9,
                color: "#fca5a5",
                border: "1px solid rgba(255,59,92,0.3)",
                background: "rgba(255,59,92,0.07)",
                padding: "2px 8px",
                borderRadius: 4,
                letterSpacing: "0.06em",
                fontWeight: 700,
              }}
            >
              KEY NAMES ONLY
            </div>
          </div>

          <div style={{ padding: "20px", minHeight: 340 }}>
            {calls.length === 0 && (
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: 12,
                  marginTop: 40,
                  textAlign: "center",
                  lineHeight: 2,
                }}
              >
                Agent is idle.
                <br />
                Run the simulation ↑
              </div>
            )}
            <AnimatePresence>
              {calls.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  style={{
                    marginBottom: 18,
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: `1px solid ${activeCallId === c.id && running ? "var(--re)" : "var(--overlay)"}`,
                    background:
                      activeCallId === c.id && running
                        ? "rgba(255,59,92,0.04)"
                        : "var(--panel-bg)",
                    transition: "all 0.3s",
                  }}
                >
                  <div
                    style={{ fontSize: 10, color: "var(--muted)", marginBottom: 6, letterSpacing: "0.04em" }}
                  >
                    {c.api.label}
                  </div>

                  {/* The KEY NAME — highlighted prominently, never the value */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: "var(--muted)" }}>credential:</span>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: "var(--am)",
                        background: "rgba(255,184,0,0.08)",
                        border: "1px solid rgba(255,184,0,0.25)",
                        padding: "2px 10px",
                        borderRadius: 5,
                        letterSpacing: "0.03em",
                      }}
                    >
                      {c.api.key}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        color: "var(--muted)",
                        border: "1px solid var(--border)",
                        padding: "1px 6px",
                        borderRadius: 4,
                      }}
                    >
                      name only
                    </span>
                  </div>

                  {/* Secret value — explicitly shown as "never accessible" */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: "var(--muted)" }}>secret value:</span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "rgba(255,59,92,0.7)",
                        letterSpacing: "0.08em",
                        fontStyle: "italic",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          padding: "1px 6px",
                          background: "rgba(255,59,92,0.1)",
                          border: "1px solid rgba(255,59,92,0.25)",
                          borderRadius: 4,
                          color: "var(--re)",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          fontStyle: "normal",
                        }}
                      >
                        NOT ACCESSIBLE
                      </span>
                    </span>
                  </div>

                  <div style={{ fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: "var(--muted)" }}>endpoint: </span>
                    <span style={{ color: "var(--sky)" }}>{c.api.ep}</span>
                  </div>

                  {c.agentPhase === "done" && (
                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{
                        marginTop: 8,
                        padding: "6px 10px",
                        background: "rgba(0,255,135,0.05)",
                        border: "1px solid var(--border-em)",
                        borderRadius: 6,
                        fontSize: 11,
                        color: "var(--em)",
                      }}
                    >
                      ✓ API response received — the secret was{" "}
                      <span style={{ fontWeight: 700 }}>never in this view</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* SPINE — interceptor */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderLeft: "1px solid var(--border)",
            borderRight: "1px solid var(--border)",
            background: "rgba(0,255,135,0.02)",
            position: "relative",
          }}
        >
          <span
            style={{
              writingMode: "vertical-lr",
              fontSize: 9,
              color: "var(--em)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              margin: "auto",
              opacity: 0.6,
            }}
          >
            AgentSecrets
          </span>
          <motion.div
            animate={
              intercepting
                ? {
                    opacity: 1,
                    scale: [1, 1.15, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(0,255,135,0.5)",
                      "0 0 0 12px rgba(0,255,135,0)",
                      "0 0 0 0 rgba(0,255,135,0)",
                    ],
                  }
                : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 1, repeat: intercepting ? Infinity : 0 }}
            style={{
              position: "absolute",
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--em)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            ⚡
          </motion.div>
        </div>

        {/* RIGHT: what actually happens */}
        <div style={{ borderLeft: "1px solid var(--border)" }}>
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid var(--border-em)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(0,255,135,0.04)",
            }}
          >
            <span style={{ fontSize: 18 }}>🔐</span>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--em)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                What Actually Happens
              </div>
              <div style={{ fontSize: 10, color: "var(--muted)" }}>
                Inside the AgentSecrets transport layer
              </div>
            </div>
            <div
              style={{
                marginLeft: "auto",
                fontSize: 9,
                color: "var(--em)",
                border: "1px solid var(--border-em)",
                background: "rgba(0,255,135,0.07)",
                padding: "2px 8px",
                borderRadius: 4,
                letterSpacing: "0.06em",
                fontWeight: 700,
              }}
            >
              REAL VALUE INJECTED HERE
            </div>
          </div>

          <div style={{ padding: "20px", minHeight: 340 }}>
            {calls.length === 0 && (
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: 12,
                  marginTop: 40,
                  textAlign: "center",
                  lineHeight: 2,
                }}
              >
                Transport layer is idle.
              </div>
            )}
            <AnimatePresence>
              {calls.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  style={{
                    marginBottom: 18,
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: `1px solid ${c.showReal ? "var(--border-em)" : "var(--overlay)"}`,
                    background: c.showReal ? "rgba(0,255,135,0.03)" : "var(--panel-bg)",
                    transition: "all 0.3s",
                  }}
                >
                  <div
                    style={{ fontSize: 10, color: "var(--muted)", marginBottom: 6, letterSpacing: "0.04em" }}
                  >
                    {c.api.label}
                  </div>

                  <div style={{ fontSize: 11, marginBottom: 6 }}>
                    <span style={{ color: "var(--muted)" }}>keychain lookup: </span>
                    <span style={{ color: "var(--am)", fontWeight: 700 }}>{c.api.key}</span>
                    <span style={{ color: "var(--em)", marginLeft: 6 }}>→ found ✓</span>
                  </div>

                  {/* THE REAL VALUE — shown here, NOT shown on agent side */}
                  <AnimatePresence>
                    {c.showReal && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ marginBottom: 6 }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 10, color: "var(--muted)" }}>real value:</span>
                          <span
                            style={{
                              background: "rgba(0,255,135,0.12)",
                              border: "1px solid var(--border-em)",
                              borderRadius: 5,
                              padding: "2px 12px",
                              fontSize: 13,
                              fontWeight: 700,
                              color: "var(--em)",
                              letterSpacing: "0.04em",
                            }}
                          >
                            {c.api.realVal}
                          </span>
                          <span
                            style={{
                              fontSize: 9,
                              color: "var(--em)",
                              border: "1px solid var(--border-em)",
                              padding: "1px 6px",
                              borderRadius: 4,
                              letterSpacing: "0.04em",
                            }}
                          >
                            in-process only · &lt;1ms
                          </span>
                        </div>
                        <div style={{ fontSize: 11, marginTop: 6 }}>
                          <span style={{ color: "var(--muted)" }}>injected into: </span>
                          <span style={{ color: "var(--sky)" }}>Authorization: Bearer</span>
                          <span style={{ color: "var(--muted)" }}> header</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {c.realPhase === "done" && (
                    <motion.div
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{
                        marginTop: 8,
                        padding: "5px 10px",
                        background: "rgba(255,59,92,0.05)",
                        border: "1px solid rgba(255,59,92,0.25)",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          color: "var(--re)",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                        }}
                      >
                        NEVER RETURNED TO AGENT
                      </span>
                      <span style={{ fontSize: 10, color: "var(--muted)" }}>
                        memory cleared immediately after injection
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── PROOF SUMMARY (appears after first call) ── */}
      <AnimatePresence>
        {calls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: -1,
              border: "1px solid var(--border-em)",
              borderTop: "none",
              borderRadius: "0 0 16px 16px",
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              background: "rgba(0,255,135,0.02)",
            }}
          >
            <div style={{ padding: "14px 20px" }}>
              <div
                style={{
                  fontSize: 9,
                  color: "#fca5a5",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 5,
                }}
              >
                Agent received
              </div>
              <div style={{ fontSize: 12, color: "var(--text)" }}>
                API responses only ·{" "}
                <span style={{ color: "#fca5a5", fontWeight: 700 }}>0 secret values</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderLeft: "1px solid var(--border)",
                borderRight: "1px solid var(--border)",
                fontSize: 16,
                padding: "0 16px",
              }}
            >
              ⚡
            </div>
            <div style={{ padding: "14px 20px" }}>
              <div
                style={{
                  fontSize: 9,
                  color: "var(--em)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 5,
                }}
              >
                Credential values seen by agent
              </div>
              <div
                style={{ fontSize: 28, fontWeight: 700, letterSpacing: -1, color: "var(--em)" }}
              >
                ZERO
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AUDIT LOG ── */}
      <AnimatePresence>
        {logRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: 16,
              border: "1px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 20px",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 11, color: "var(--muted)" }}>
                📋 Audit log — auto-generated after each API call
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: "var(--re)",
                  border: "1px solid rgba(255,59,92,0.3)",
                  background: "rgba(255,59,92,0.07)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                &quot;value&quot; column — not in schema
              </span>
            </div>

            {/* table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 120px 1fr 70px 100px",
                padding: "10px 20px",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg2)",
                fontSize: 9,
                color: "var(--muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              <div>Time</div>
              <div>Key Name</div>
              <div>Endpoint</div>
              <div>Status</div>
              <div>Value logged</div>
            </div>

            <AnimatePresence>
              {logRows.map((row) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 120px 1fr 70px 100px",
                    padding: "12px 20px",
                    borderBottom: "1px solid var(--overlay)",
                    fontSize: 11,
                    alignItems: "center",
                    background: "var(--code-bg)",
                  }}
                >
                  <div style={{ color: "var(--muted)" }}>{row.ts}</div>
                  <div style={{ color: "var(--am)", fontWeight: 700 }}>{row.api.key}</div>
                  <div style={{ color: "var(--muted)", fontSize: 10 }}>{row.api.ep}</div>
                  <div>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--em)",
                        display: "inline-block",
                        marginRight: 4,
                      }}
                    />
                    <span style={{ color: "var(--em)" }}>200</span>
                  </div>
                  <div>
                    <motion.span
                      initial={row.isNew ? { scale: 1.15 } : { scale: 1 }}
                      animate={{ scale: 1 }}
                      style={{
                        fontSize: 10,
                        color: "var(--re)",
                        border: "1px solid rgba(255,59,92,0.3)",
                        background: "rgba(255,59,92,0.07)",
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontWeight: 700,
                        display: "inline-block",
                      }}
                    >
                      ABSENT
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div
              style={{
                padding: "10px 20px",
                fontSize: 10,
                color: "var(--muted)",
                borderTop: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--code-bg)",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "var(--re)",
                  border: "1px solid rgba(255,59,92,0.3)",
                  background: "rgba(255,59,92,0.07)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontWeight: 700,
                }}
              >
                ABSENT
              </span>
              <span>
                = this column does not exist in the audit schema. It was never designed to hold a
                value — so it cannot be leaked, redacted, or subpoenaed.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
