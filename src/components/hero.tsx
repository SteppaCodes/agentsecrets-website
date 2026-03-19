"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const cmd = "npx @the-17/agentsecrets init";

  const copy = () => {
    navigator.clipboard?.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.34, 1.56, 0.64, 1] as const },
  });

  return (
    <section
      className="hero-section"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 15px",
        paddingTop: "max(0px, env(safe-area-inset-top))",
        paddingBottom: "max(0px, env(safe-area-inset-bottom))",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Badge */}
      <motion.div {...fadeUp(0)} style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        border: "1px solid var(--border-em)",
        background: "rgba(0,255,135,0.05)",
        color: "var(--em)",
        fontSize: 10,
        padding: "6px 14px",
        borderRadius: 100,
        marginBottom: 32,
        letterSpacing: "0.1em",
      }}>
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--em)", display: "inline-block",
            boxShadow: "0 0 6px var(--em)",
          }}
        />
        Zero-knowledge secrets infrastructure
      </motion.div>

      {/* Headline */}
      <motion.h1
        {...fadeUp(0.1)}
        style={{
          fontSize: "clamp(28px, 4.5vw, 56px)",
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-1px",
          marginBottom: 24,
        }}
      >
        Your agent uses the credential.
        <br />
        <span style={{ color: "var(--em)" }}>It never holds it.</span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        className="hero-sub"
        {...fadeUp(0.2)}
        style={{
          fontSize: 13,
          color: "var(--muted)",
          maxWidth: 580,
          lineHeight: 2,
          margin: "0 auto 40px",
        }}
      >
        <span className="hero-sub-full">
          Most secrets tools protect keys at rest. The moment your agent retrieves one
          to use it, that protection ends. AgentSecrets changes where injection happens
          and what the agent is allowed to see.
        </span>
        <span className="hero-sub-short">
          Most secrets tools protect keys at rest. AgentSecrets changes where
          injection happens and what the agent is allowed to see.
        </span>
      </motion.p>

      {/* Buttons */}
      <motion.div
        {...fadeUp(0.3)}
        style={{
          display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
        }}
      >
        <Link href="/docs" style={{ textDecoration: "none" }}>
        <motion.button
          whileHover={{ scale: 1.03, y: -2, boxShadow: "0 14px 36px var(--border-em)", background: "var(--text)" }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{
            padding: "12px 26px", background: "var(--em)", color: "var(--bg)",
            fontWeight: 700, fontSize: 12, borderRadius: 9, border: "none",
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Read the docs →
        </motion.button>
        </Link>
        <motion.a
          whileHover={{ borderColor: "var(--border)", background: "var(--overlay)" }}
          whileTap={{ scale: 0.97 }}
          href="https://github.com/The-17/agentsecrets"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "12px 26px", background: "transparent", color: "var(--text)",
            fontWeight: 700, fontSize: 12, borderRadius: 9, border: "1px solid var(--border)",
            cursor: "pointer", textDecoration: "none", display: "inline-block",
            transition: "all 0.25s",
          }}
        >
          GitHub
        </motion.a>
      </motion.div>

      {/* Install bar */}
      <motion.div
        className="hero-install-bar"
        {...fadeUp(0.38)}
        onClick={copy}
        whileHover={{ boxShadow: "0 0 32px rgba(0,255,135,0.12)" }}
        style={{
          display: "flex", alignItems: "center", marginTop: 32,
          border: "1px solid var(--border-em)", borderRadius: 11,
          overflow: "hidden", background: "var(--code-bg)",
          maxWidth: 490, width: "100%", cursor: "pointer",
          transition: "box-shadow 0.25s",
        }}
      >
        <div className="prompt-col" style={{
          padding: "13px 15px", color: "var(--text)", fontSize: 13, fontWeight: 700,
          borderRight: "1px solid var(--border)", background: "rgba(0,255,135,0.04)", flexShrink: 0,
        }}>
          $
        </div>
        <div className="cmd-text" style={{
          flex: 1, padding: "13px 15px", fontSize: 12, color: "var(--text)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "left",
        }}>
          {cmd}
        </div>
        <motion.div
          className="copy-col"
          animate={copied ? { color: "var(--em)" } : { color: "var(--muted)" }}
          style={{
            padding: "13px 15px", borderLeft: "1px solid var(--border)",
            fontSize: 10, whiteSpace: "nowrap", flexShrink: 0, transition: "color 0.2s",
          }}
        >
          {copied ? "✓ copied" : "copy"}
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="hero-stats"
        {...fadeUp(0.46)}
        style={{
          display: "grid", gridTemplateColumns: "repeat(3,1fr)",
          border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
          margin: "40px auto 0", maxWidth: 520, background: "var(--bg2)", width: "100%",
        }}
      >
        {[
          { v: "ZERO", l: "secrets in agent context — ever" },
          { v: "MIT", l: "open source, all repos" },
          { v: "6", l: "auth injection styles" },
        ].map(({ v, l }, i) => (
          <div className="hero-stat-item" key={l} style={{
            padding: "18px", textAlign: "center",
            borderRight: i < 2 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--em)" }}>{v}</div>
            <div className="hero-stat-label" style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, letterSpacing: "0.06em" }}>{l}</div>
          </div>
        ))}
      </motion.div>

      {/* Scroll hint */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        style={{
          position: "relative",
          marginTop: 24,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        }}
      >
        <span style={{ fontSize: 9, color: "var(--muted)", letterSpacing: "0.12em" }}>
          WATCH THE PROTOCOL
        </span>
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: 1, height: 32,
            background: "linear-gradient(to bottom, var(--em), transparent)",
          }}
        />
      </motion.div> */}
    </section>
  );
}
