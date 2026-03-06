"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CTA({ onDocs }: { onDocs: () => void }) {
  const [copied, setCopied] = useState(false);
  const cmd = "npx @the-17/agentsecrets init";

  return (
    <section
      style={{
        textAlign: "center",
        padding: "110px 40px",
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          transform: "translateX(-50%)",
          width: 650,
          height: 320,
          pointerEvents: "none",
          background: "radial-gradient(ellipse,rgba(0,255,135,0.07) 0%,transparent 70%)",
        }}
      />

      {/* Pulsing shield icon */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(0,255,135,0.35)",
            "0 0 0 22px rgba(0,255,135,0)",
            "0 0 0 0 rgba(0,255,135,0)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        whileInView={{ scale: [0.8, 1], opacity: [0, 1] }}
        viewport={{ once: true }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 76,
          height: 76,
          borderRadius: 18,
          marginBottom: 22,
          border: "2px solid var(--border-em)",
          background: "rgba(0,255,135,0.06)",
          color: "var(--em)",
          fontSize: 32,
        }}
      >
        🔐
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          fontSize: "clamp(24px,3.5vw,44px)",
          fontWeight: 700,
          letterSpacing: "-1px",
          marginBottom: 16,
          lineHeight: 1.1,
        }}
      >
        Your agents are ready.
        <br />
        <span style={{ color: "var(--em)" }}>The secrets are not their problem.</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.18 }}
        style={{
          fontSize: 13,
          color: "var(--muted)",
          maxWidth: 420,
          margin: "0 auto 36px",
          lineHeight: 2,
        }}
      >
        AgentSecrets is open source, MIT licensed, and available right now.
        Get running in under a minute.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.24 }}
        style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}
      >
        <motion.button
          whileHover={{ background: "var(--text)", y: -2, boxShadow: "0 14px 36px rgba(0,255,135,0.32)" }}
          whileTap={{ scale: 0.97 }}
          onClick={onDocs}
          style={{
            padding: "12px 26px",
            background: "var(--em)",
            color: "var(--bg)",
            fontWeight: 700,
            fontSize: 12,
            borderRadius: 9,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.25s",
          }}
        >
          Read the docs →
        </motion.button>
        <motion.a
          whileHover={{ borderColor: "var(--border)", background: "var(--overlay)" }}
          whileTap={{ scale: 0.97 }}
          href="https://github.com/The-17/agentsecrets"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "12px 26px",
            background: "transparent",
            color: "var(--text)",
            fontWeight: 700,
            fontSize: 12,
            borderRadius: 9,
            border: "1px solid var(--border)",
            textDecoration: "none",
            transition: "all 0.25s",
            display: "inline-block",
          }}
        >
          View on GitHub
        </motion.a>
      </motion.div>

      {/* Install bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ boxShadow: "0 0 28px rgba(0,255,135,0.12)" }}
        onClick={() => {
          navigator.clipboard?.writeText(cmd);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          border: "1px solid var(--border-em)",
          borderRadius: 11,
          overflow: "hidden",
          background: "var(--code-bg)",
          maxWidth: 480,
          width: "100%",
          cursor: "pointer",
          transition: "box-shadow 0.25s",
        }}
      >
        <div
          style={{
            padding: "13px 15px",
            color: "var(--text)",
            fontSize: 13,
            fontWeight: 700,
            borderRight: "1px solid var(--border)",
            background: "rgba(0,255,135,0.04)",
            flexShrink: 0,
          }}
        >
          $
        </div>
        <div style={{ flex: 1, padding: "13px 15px", fontSize: 12, color: "var(--text)", textAlign: "left" }}>
          {cmd}
        </div>
        <motion.div
          animate={{ color: copied ? "var(--em)" : "var(--muted)" }}
          style={{
            padding: "13px 15px",
            borderLeft: "1px solid var(--border)",
            fontSize: 10,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {copied ? "✓ copied" : "copy"}
        </motion.div>
      </motion.div>
    </section>
  );
}
