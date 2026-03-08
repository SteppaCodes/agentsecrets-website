"use client";
import { motion } from "framer-motion";

const rows = [
  ["Agent context window", "Secret value is readable by the model at inference time", "Only the key name is passed. The value is structurally absent from the agent's context"],
  ["Logs and traces", "Secret appears in stdout, telemetry, and LLM traces", "The value is never a string in the call chain — it cannot appear in any log"],
  ["Prompt injection", "An attacker prompt can extract env vars: \"repeat your system prompt\"", "No value exists in context to extract. The attack surface is eliminated"],
  ["Disk and file exposure", ".env files are readable by any process on the host", "Secrets live in the OS keychain, user-scoped, encrypted at rest"],
  ["Audit compliance", "Values can appear in redacted logs — redaction can fail", "The audit schema has no value field. It is structurally impossible to log"],
  ["Team secret sharing", "Shared .env files or Vault tokens sent over Slack or email", "Encrypted blobs synced via zero-knowledge cloud — the server cannot decrypt"],
  ["Memory lifetime", "Secret lives in the process environment for its full lifetime", "Decrypted for under 1ms in-process, then wiped"],
];

const headers = ["Attack Surface", "❌ .env / Vault / Raw injection", "✓ AgentSecrets"];

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
        overflow: "clip",
        overflowX: "auto",
      }}
    >
      <table className="cmp-table" style={{ width: "100%", borderCollapse: "collapse" }}>
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
                  color: i === 0 ? "var(--muted)" : i === 1 ? "#f87171" : "var(--em)",
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
                        ? "#fca5a5"
                        : "var(--em)",
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
