"use client";
import { motion } from "framer-motion";

const rows = [
  ["Agent as operator", "✅ Full lifecycle", "❌ Consumer only", "❌ Consumer only", "❌ Consumer only", "❌ Consumer only"],
  ["Zero-knowledge end to end", "✅ Every step", "❌ Agent retrieves value", "❌ Agent retrieves value", "❌ Agent retrieves value", "⚠️ Partial"],
  ["Domain allowlist enforcement", "✅ Deny-by-default", "❌", "❌", "❌", "❌"],
  ["Response body redaction", "✅ Echo exfiltration defense", "❌", "❌", "❌", "❌"],
  ["Prompt injection protection", "✅ Structural", "❌", "❌", "❌", "❌"],
  ["Env var injection (env --)", "✅ agentsecrets env", "❌", "❌", "✅ doppler run", "✅ op run"],
  ["AI-native workflow", "✅ Built for it", "❌", "❌", "❌", "❌"],
  ["Team workspaces", "✅ Built-in", "⚠️ Complex", "⚠️ IAM roles", "✅", "✅ Vaults"],
  ["OS keychain storage", "✅", "❌", "❌", "❌", "✅"],
  ["Setup time", "⚡ 1 minute", "⏱️ Hours", "⏱️ 30+ min", "⏱️ 10 min", "⏱️ 5 min"],
  ["Free", "✅", "✅ OSS", "⚠️ AWS costs", "⚠️ Limited", "❌"],
];

const headers = ["Feature", "AgentSecrets", "HashiCorp Vault", "AWS Secrets Mgr", "Doppler", "1Password"];

export default function ComparisonTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
      id="comparison"
      style={{
        marginTop: 52,
        border: "1px solid var(--border)",
        borderRadius: 13,
        overflow: "hidden",
        overflowX: "auto",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--bg2)" }}>
            {headers.map((h, i) => (
              <th
                key={h}
                style={{
                  padding: "13px 20px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textAlign: "left",
                  borderBottom: "1px solid var(--border)",
                  color: i === 0 ? "var(--muted)" : i === 1 ? "var(--em)" : "#f87171",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <motion.tr
              key={ri}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: ri * 0.04, duration: 0.35 }}
              whileHover={{ backgroundColor: "var(--overlay)" }}
              style={{
                borderBottom: ri < rows.length - 1 ? "1px solid var(--overlay)" : "none",
              }}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "12px 20px",
                    fontSize: ci === 0 ? 12 : 11,
                    lineHeight: "1.7",
                    verticalAlign: "top",
                    borderRight: ci < row.length - 1 ? "1px solid var(--border)" : "none",
                    color:
                      ci === 0
                        ? "var(--text)"
                        : ci === 1
                        ? "var(--em)"
                        : "#fca5a5",
                    whiteSpace: ci === 0 ? "nowrap" : "normal",
                  }}
                >
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
