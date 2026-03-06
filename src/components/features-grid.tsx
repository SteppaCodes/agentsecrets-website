"use client";
import { motion } from "framer-motion";
import {
  Shield, Key, Zap, Users, Lock, Eye,
} from "lucide-react";

const features = [
  {
    Icon: Shield,
    title: "Zero-Knowledge Architecture",
    desc: "The secret value is decrypted in-process, injected at the transport layer, and cleared from memory. The agent never receives or stores the plaintext. Not at any step.",
    badge: null,
    color: "var(--em)",
  },
  {
    Icon: Key,
    title: "OS Keychain Storage",
    desc: "macOS Keychain, Linux Secret Service, and Windows Credential Manager. Not a .env file. Not an environment variable. A cryptographically secured OS credential store.",
    badge: null,
    color: "var(--sky)",
  },
  {
    Icon: Zap,
    title: "6 Auth Injection Styles",
    desc: "Bearer token, API key header, Basic auth, query parameter, JSON body injection, and form field injection. Covers every REST and OAuth pattern.",
    badge: null,
    color: "var(--am)",
  },
  {
    Icon: Users,
    title: "Team Workspaces & Cloud Sync",
    desc: "Share credentials across a team — encrypted client-side before upload. The server holds only ciphertext and cannot decrypt your secrets. New devs onboard in seconds.",
    badge: null,
    color: "var(--vi)",
  },
  {
    Icon: Lock,
    title: "Domain Allowlist Enforcement",
    desc: "Authorize the exact domains your agents can reach. Deny-by-default posture — any unapproved endpoint is blocked at the proxy level, not by policy.",
    badge: "NEW",
    color: "var(--em)",
  },
  {
    Icon: Eye,
    title: "Response Body Redaction",
    desc: "AgentSecrets scans API responses for patterns that look like credential values and redacts them before returning to the agent — echo exfiltration defense built in.",
    badge: "NEW",
    color: "var(--re)",
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
