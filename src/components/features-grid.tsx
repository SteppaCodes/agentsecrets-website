"use client";
import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="16" cy="16" r="6" />
        <path d="M16 2v6M16 24v6M2 16h6M24 16h6M5.5 5.5l4.2 4.2M22.3 22.3l4.2 4.2M5.5 26.5l4.2-4.2M22.3 9.7l4.2-4.2" />
      </svg>
    ),
    title: "OS Keychain Storage",
    desc: "Credentials live in the OS keychain. macOS Keychain, Linux Secret Service, Windows Credential Manager. No plaintext on disk, no environment variable exposed to neighboring processes.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="16" cy="16" r="12" />
        <circle cx="16" cy="16" r="4" fill="currentColor" />
      </svg>
    ),
    title: "Six Auth Styles",
    desc: "Bearer, Basic, custom header, query param, JSON body, form field. Every REST and OAuth pattern has a corresponding injection style.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M16 2l4 8 8 2-6 6 2 8-8-4-8 4 2-8-6-6 8-2z" />
      </svg>
    ),
    title: "Domain Allowlist",
    desc: "Deny-by-default. Every outbound request must target an authorized domain. Unauthorized attempts are blocked and logged before injection happens.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="4" y="4" width="24" height="24" rx="4" />
        <line x1="10" y1="12" x2="22" y2="12" />
        <line x1="10" y1="16" x2="18" y2="16" />
        <line x1="10" y1="20" x2="22" y2="20" />
      </svg>
    ),
    title: "Response Redaction",
    desc: "If an API echoes a credential back in its response, the proxy catches and redacts it before the agent sees the response.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="14" r="5" />
        <circle cx="20" cy="14" r="5" />
        <path d="M4 26c0-4 4-7 8-7s8 3 8 7" />
        <path d="M20 26c0-4 4-7 8-7" />
      </svg>
    ),
    title: "Team Workspaces",
    desc: "Secrets encrypted client-side before upload. The server holds ciphertext. A new developer onboards without anyone sharing credentials over Slack.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M6 6h20v20H6z" />
        <path d="M6 12h20M12 12v14" />
      </svg>
    ),
    title: "Audit Log",
    desc: "Every proxied request logged. Key name, endpoint, status, timing. No value field, because there is nowhere to put one.",
  },
];

export default function FeaturesGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        marginTop: 48,
        background: "rgba(206, 206, 206, 0.03)",
        border: "1px solid rgba(206, 206, 206, 0.06)",
        borderRadius: 12,
        padding: "64px 56px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "56px 48px",
        }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Icon */}
            <div
              style={{
                color: "rgba(206, 206, 206, 0.5)",
                marginBottom: 24,
              }}
            >
              {f.icon}
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: "clamp(17px, 1.8vw, 21px)",
                fontWeight: 700,
                lineHeight: 1.25,
                letterSpacing: "-0.3px",
                color: "var(--text)",
                marginBottom: 12,
              }}
            >
              {f.title}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: 11.5,
                color: "var(--muted)",
                lineHeight: 1.85,
              }}
            >
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
