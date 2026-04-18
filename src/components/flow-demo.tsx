"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { label: "Agent Request", sub: "key name only", icon: "🤖" },
  { label: "Secure Lookup", sub: "OS keychain", icon: "🔐" },
  { label: "Injection", sub: "transport layer", icon: "⚡" },
  { label: "API Call", sub: "signed request", icon: "🌐" },
  { label: "Context Clear", sub: "memory wiped", icon: "✅" },
];

const TLINES = [
  [
    { t: "$ agentsecrets call\\", c: "c-mu" },
    { t: "  --url api.stripe.com\\", c: "c-mu" },
    { t: "  --bearer STRIPE_KEY", c: "c-mu", p: 400 },
  ],
  [
    { t: "→ Lookup: STRIPE_KEY", c: "c-mu" },
    { t: "→ Match: 9A2F:4C18...", c: "c-mu", p: 520 },
  ],
  [
    { t: "→ Injection: [HTTP]", c: "c-mu" },
    { t: "⚡ SECRETS REMAIN EXTERNAL", c: "c-mu", p: 450 },
  ],
  [
    { t: "→ POST /v1/balance", c: "c-mu" },
    { t: "→ 200 OK · 143ms", c: "c-mu", p: 380 },
  ],
  [
    { t: '✓ {"amount":24350}', c: "c-mu" },
    { t: "✓ Memory Cleared", c: "c-mu" },
  ],
];

interface PrintedLine {
  text: string;
  cls: string;
  d?: boolean;
}

// Circle radius (px) — the orbit radius and node circle size
const ORBIT_R = 230;      // how far from center each node is
const NODE_R  = 22;       // radius of each circle glyph

export default function FlowDemo() {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const [packet, setPacket] = useState(-1);
  const [printed, setPrinted] = useState<Record<number, PrintedLine[]>>({});
  const [typing, setTyping] = useState<{ step: number; line: PrintedLine & { caret?: boolean } } | null>(null);

  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sRef = useRef({ step: -1, li: 0, ci: 0, phase: "idle" });
  const runRef = useRef<() => void>(() => {});

  const clear = useCallback(() => {
    if (tRef.current) clearTimeout(tRef.current);
    setPhase("idle");
    setDoneSteps([]);
    setPacket(-1);
    setPrinted({});
    setTyping(null);
    sRef.current = { step: -1, li: 0, ci: 0, phase: "idle" };
  }, []);

  const next = useCallback(() => {
    const s = sRef.current;
    if (s.phase !== "running") return;
    const lines = TLINES[s.step];
    if (!lines) return;
    const line = lines[s.li];
    if (!line) return;

    if (s.ci < line.t.length) {
      s.ci++;
      setTyping({
        step: s.step,
        line: { text: line.t.slice(0, s.ci), cls: line.c, caret: true },
      });
      tRef.current = setTimeout(next, 45);
      return;
    }

    setPrinted((p) => ({
      ...p,
      [s.step]: [...(p[s.step] || []), { text: line.t, cls: line.c }],
    }));
    setTyping(null);
    s.li++;
    s.ci = 0;

    if (s.li < lines.length) {
      tRef.current = setTimeout(next, (line as { p?: number }).p || 350);
      return;
    }

    tRef.current = setTimeout(() => {
      if (sRef.current.phase !== "running") return;
      const cs = s.step;
      setPacket(cs); // start packet animation from cs → cs+1
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
          setRotation((r) => r - 360 / STEPS.length);
          tRef.current = setTimeout(next, 1100);
        } else {
          s.step = 0;
          s.li = 0;
          s.ci = 0;
          setActiveStep(0);
          setRotation((r) => r - 360 / STEPS.length);
          setDoneSteps([]);
          setPrinted({});
          tRef.current = setTimeout(next, 4500);
        }
      }, 1400);
    }, 1000);
  }, []);

  const run = useCallback(() => {
    if (tRef.current) clearTimeout(tRef.current);
    sRef.current = { step: 0, li: 0, ci: 0, phase: "running" };
    setPhase("running");
    setActiveStep(0);
    setRotation(0);
    next();
  }, [next]);

  runRef.current = run;

  useEffect(() => () => { if (tRef.current) clearTimeout(tRef.current); }, []);
  useEffect(() => {
    const timer = setTimeout(() => { if (typeof window !== "undefined") run(); }, 1200);
    return () => clearTimeout(timer);
  }, [run]);

  const N = STEPS.length;
  const angleStep = (2 * Math.PI) / N;

  // Get circle center coordinates for step i (in SVG space, center at 0,0)
  const getCenter = (i: number) => {
    const a = i * angleStep - Math.PI / 2; // start from top
    return {
      x: ORBIT_R * Math.cos(a),
      y: ORBIT_R * Math.sin(a),
    };
  };

  // SVG viewport dims
  const VW = (ORBIT_R + NODE_R + 10) * 2;
  const VH = VW;

  return (
    <div
      className="flow-orbital-root"
      style={{
        width: "100%",
        height: 340,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1200px",
        overflow: "visible",
        position: "relative",
      }}
    >
      {/* ── 3D rotating plate ── */}
      <motion.div
        animate={{
          rotateY: rotation,
          rotateX: 5,
          transition: { duration: 2.0, ease: "easeInOut" },
        }}
        style={{
          width: 0,
          height: 0,
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {/* ── SVG layer: orbit ring + arcs ── */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: VW,
            height: VH,
            transform: `translate(-50%, -50%) rotateX(90deg)`,
            overflow: "visible",
            pointerEvents: "none",
          }}
          viewBox={`${-VW / 2} ${-VH / 2} ${VW} ${VH}`}
        >
          {/* Ghost orbit ring */}
          <circle cx="0" cy="0" r={ORBIT_R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

          {STEPS.map((_, i) => {
            const from = getCenter(i);
            const to   = getCenter((i + 1) % N);

            // Direction vector, normalized
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const nx = dx / dist;
            const ny = dy / dist;

            // Start and end at circle edges, not at centers
            const x1 = from.x + nx * NODE_R;
            const y1 = from.y + ny * NODE_R;
            const x2 = to.x   - nx * NODE_R;
            const y2 = to.y   - ny * NODE_R;

            const isTraveling = packet === i;
            const isFinished  = doneSteps.includes(i);

            return (
              <g key={i}>
                {/* Static track */}
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                  strokeLinecap="round"
                />

                {/* History / completed arc glow */}
                {isFinished && (
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="rgba(0,255,135,0.2)"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                )}

                {/* Animated traveling line */}
                {isTraveling && (
                  <motion.line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="rgba(0,255,135,0.9)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="1"
                    strokeDashoffset="1"
                    pathLength={1}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "linear" }}
                  />
                )}

                {/* Traveling packet dot */}
                {isTraveling && (
                  <motion.circle
                    r={3}
                    fill="#00ff87"
                    filter="url(#glow)"
                    initial={{ cx: x1, cy: y1, opacity: 0 }}
                    animate={{ cx: x2, cy: y2, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.2, ease: "linear" }}
                  />
                )}
              </g>
            );
          })}

          {/* Glow filter */}
          <defs>
            <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* ── Nodes (face-billed plates) ── */}
        {STEPS.map((s, i) => {
          const isActive = i === activeStep;
          const isDone   = doneSteps.includes(i);
          const plateAngle = i * (360 / N);

          return (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                left: -60,
                top: -80,
                width: 120,
                transformStyle: "preserve-3d",
                transform: `rotateY(${plateAngle}deg) translateZ(${ORBIT_R}px)`,
              }}
            >
              <motion.div
                animate={{
                  rotateY: -rotation - plateAngle,
                  scale: isActive ? 1.05 : 0.85,
                  opacity: isActive ? 1 : isDone ? 0.45 : 0.2,
                }}
                transition={{ duration: 2.0, ease: "easeInOut" }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Circle node */}
                <motion.div
                  animate={{
                    borderColor: isActive
                      ? "rgba(0,255,135,0.6)"
                      : isDone
                      ? "rgba(0,255,135,0.18)"
                      : "rgba(255,255,255,0.07)",
                    background: isActive
                      ? "rgba(0,255,135,0.08)"
                      : "transparent",
                    boxShadow: isActive
                      ? "0 0 24px rgba(0,255,135,0.25)"
                      : "none",
                  }}
                  style={{
                    width: NODE_R * 2,
                    height: NODE_R * 2,
                    borderRadius: "50%",
                    border: "1px solid",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    marginBottom: 10,
                    transition: "all 0.5s",
                    flexShrink: 0,
                  }}
                >
                  {isDone ? "✓" : s.icon}
                </motion.div>

                {/* Label */}
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: "Helvetica, Arial, sans-serif",
                      color: isActive ? "#ffffff" : "rgba(255,255,255,0.2)",
                      marginBottom: 3,
                      transition: "color 0.5s",
                      letterSpacing: "-0.1px",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "rgba(255,255,255,0.1)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {s.sub}
                  </div>
                </div>

                {/* Terminal log — only visible when active */}
                <div
                  style={{
                    width: 150,
                    minHeight: 60,
                    fontSize: 9,
                    fontFamily: "'Space Mono', monospace",
                    lineHeight: 1.7,
                    textAlign: "left",
                    opacity: isActive ? 0.8 : 0,
                    transition: "opacity 0.4s",
                    transform: "translateZ(8px)",
                  }}
                >
                  {printed[i] &&
                    printed[i].map((l, li) => (
                      <div
                        key={li}
                        style={{ color: "rgba(255,255,255,0.25)", whiteSpace: "pre" }}
                      >
                        {l.text}
                      </div>
                    ))}
                  {typing && typing.step === i && (
                    <div style={{ color: "rgba(0,255,135,0.6)", whiteSpace: "pre" }}>
                      {typing.line.text}
                      <span style={{ animation: "blink 1s step-end infinite" }}>▌</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Center label */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.12)",
            textTransform: "uppercase",
          }}
        >
          agentsecrets
        </div>
        <div
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "rgba(0,255,135,0.4)",
            boxShadow: "0 0 8px rgba(0,255,135,0.6)",
          }}
        />
      </div>
    </div>
  );
}
