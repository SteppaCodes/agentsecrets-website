"use client";
import { motion } from "framer-motion";
import {
  Key, Zap, Shield, Search, Globe, Users, FileText, Bot, Terminal
} from "lucide-react";

const features = [
  {
    Icon: Key,
    title: "OS Keychain Storage",
    desc: "Secrets live in macOS Keychain, Linux Secret Service, or Windows Credential Manager. Never on disk as plaintext. Never in environment variables. The OS enforces access control — other processes cannot read your credentials.",
    badge: null,
    color: "var(--em)",
  },
  {
    Icon: Zap,
    title: "Transport-Layer Injection",
    desc: "The credential value is resolved inside the proxy and injected at the HTTP transport layer — after the agent boundary. It never appears in any MCP tool call, SDK method signature, or subprocess argument.",
    badge: null,
    color: "var(--am)",
  },
  {
    Icon: Shield,
    title: "Domain Allowlist",
    desc: "The proxy is deny-by-default. Every domain must be explicitly authorized. SSRF attacks and prompt injection exfiltration attempts are blocked before any credential is injected. Allowlist changes require admin role and password.",
    badge: null,
    color: "var(--em)",
  },
  {
    Icon: Search,
    title: "Response Body Redaction",
    desc: "The proxy scans every API response for patterns matching the injected value. If a credential echo is detected, it is replaced with [REDACTED_BY_AGENTSECRETS] before the response reaches your code. The attempt is logged.",
    badge: null,
    color: "var(--re)",
  },
  {
    Icon: Globe,
    title: "Zero-Knowledge Cloud Sync",
    desc: "X25519 key exchange plus AES-256-GCM with Argon2id key derivation. The server stores only ciphertext. It holds no encryption keys and cannot decrypt your secrets. Share across machines and teammates without any plaintext leaving your device.",
    badge: "SOON",
    color: "var(--sky)",
  },
  {
    Icon: Users,
    title: "Team Workspaces",
    desc: "Multiple members share a project's encrypted secret store. Role-based access control per key. Admins manage the domain allowlist. Every access is logged by key name — never by value.",
    badge: "SOON",
    color: "var(--vi)",
  },
  {
    Icon: FileText,
    title: "Structural Audit Log",
    desc: "JSONL entries after every proxied request: timestamp, key name, endpoint, status, latency. The value column does not exist in the schema. Omission is stronger than redaction — what was never written cannot be leaked.",
    badge: null,
    color: "var(--sky)",
  },
  {
    Icon: Bot,
    title: "MCP Native",
    desc: "First-class Claude Desktop and Cursor integration via Model Context Protocol. One command auto-configures your client. Claude can call any authenticated API — it never sees a credential value.",
    badge: null,
    color: "var(--em)",
  },
  {
    Icon: Terminal,
    title: "Python SDK",
    desc: "The SDK has no get() method. The only way to use a credential is to make the call or spawn the process. client.call(), client.spawn(), and the full management layer — workspaces, projects, allowlist, audit log — all from Python.",
    badge: null,
    color: "var(--am)",
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

      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 7, position: "relative" }}>
        {title}
      </div>
      <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.9, position: "relative" }}>
        {desc}
      </div>
    </motion.div>
  );
}

export default function FeaturesGrid() {
  return (
    <div
      id="features"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
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
