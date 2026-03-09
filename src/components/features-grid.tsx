"use client";
import { motion } from "framer-motion";
import {
  Key, Zap, Shield, Search, Users, FileText
} from "lucide-react";

const features = [
  {
    Icon: Key,
    title: "OS Keychain Storage",
    desc: "Credentials live in the OS keychain. macOS Keychain, Linux Secret Service, Windows Credential Manager. No plaintext on disk, no environment variable exposed to neighboring processes.",
    badge: null,
    color: "var(--em)",
  },
  {
    Icon: Zap,
    title: "Six Auth Styles",
    desc: "Bearer, Basic, custom header, query param, JSON body, form field. Every REST and OAuth pattern has a corresponding injection style.",
    badge: null,
    color: "var(--am)",
  },
  {
    Icon: Shield,
    title: "Domain Allowlist",
    desc: "Deny-by-default. Every outbound request must target an authorized domain. Unauthorized attempts are blocked and logged before injection happens.",
    badge: null,
    color: "var(--em)",
  },
  {
    Icon: Search,
    title: "Response Redaction",
    desc: "If an API echoes a credential back in its response, the proxy catches and redacts it before the agent sees the response.",
    badge: null,
    color: "var(--re)",
  },
  {
    Icon: Users,
    title: "Team Workspaces",
    desc: "Secrets encrypted client-side before upload. The server holds ciphertext. A new developer onboards without anyone sharing credentials over Slack.",
    color: "var(--vi)",
  },
  {
    Icon: FileText,
    title: "Audit Log",
    desc: "Every proxied request logged. Key name, endpoint, status, timing. No value field, because there is nowhere to put one.",
    badge: null,
    color: "var(--sky)",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const { Icon, title, desc, badge, color } = feature;

  return (
    <motion.div
      className="feat-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 22px 48px var(--shadow)",
        borderColor: "var(--border-em)",
        transition: { type: "spring", stiffness: 350, damping: 22 },
      }}
      style={{
        border: "1px solid var(--border)",
        borderRadius: 13,
        padding: 22,
        background: "var(--bg2)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Hover glow */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 10% 0%,rgba(0,255,135,0.07) 0%,transparent 65%)",
          pointerEvents: "none",
          transition: "opacity 0.35s",
        }}
      />

      {/* Badge */}
      {badge && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "2px 7px",
            borderRadius: 100,
            border: "1px solid rgba(255,184,0,0.35)",
            color: "var(--am)",
          }}
        >
          {badge}
        </div>
      )}

      {/* Icon */}
      <motion.div
        whileHover={{
          scale: 1.12,
          rotate: -6,
          transition: { type: "spring", stiffness: 420, damping: 16 },
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "rgba(0,255,135,0.07)",
          border: "1px solid var(--border-em)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <Icon size={17} color={color} strokeWidth={1.6} />
      </motion.div>

      <div className="feat-title" style={{ fontSize: 13, fontWeight: 700, marginBottom: 7, position: "relative" }}>
        {title}
      </div>
      <div className="feat-desc" style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.9, position: "relative" }}>
        {desc}
      </div>
    </motion.div>
  );
}

export default function FeaturesGrid() {
  return (
    <div
      id="features"
      className="feat-grid"
      style={{
        display: "grid",
        gap: 10,
        marginTop: 48,
      }}
    >
      {features.map((f, i) => (
        <FeatureCard key={f.title} feature={f} index={i} />
      ))}
    </div>
  );
}
