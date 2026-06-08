"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 4L36 20L20 36L4 20Z" />
        <circle cx="20" cy="20" r="4" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: "OS Keychain\nStorage",
    desc: "Credentials reside securely within the native OS keychain—macOS Keychain, Linux Secret Service, or Windows Credential Manager. Plaintext is never written to disk, and no environment variable is exposed for neighboring processes to scrape.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="20,4 34,12 34,28 20,36 6,28 6,12" />
        <circle cx="20" cy="20" r="3" fill="currentColor" stroke="none" />
        <path d="M20 4V17 M34 12L22.5 18.5 M34 28L22.5 21.5 M20 36V23 M6 28L17.5 21.5 M6 12L17.5 18.5" />
      </svg>
    ),
    title: "Zero-Knowledge\nProxy",
    desc: "All credentialed traffic routes through a secure proxy. Keys are resolved from the keychain and injected at the transport layer, returning only the API response to the agent. Value exposure is prevented in memory, logs, and CLI execution.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="20" r="16" />
        <circle cx="20" cy="20" r="8" />
        <path d="M20 4V12 M20 28V36 M4 20H12 M28 20H36" />
      </svg>
    ),
    title: "Layered\nEnforcement",
    desc: "Requests pass through a multi-stage pipeline before key resolution. Agent capabilities restrict credential access, the domain allowlist controls outbound destinations, and secrets policies define usage rules. Each enforcement layer is independent, composable, and extensible.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="6" y="6" width="10" height="10" rx="1" />
        <rect x="24" y="6" width="10" height="10" rx="1" />
        <rect x="15" y="24" width="10" height="10" rx="1" />
        <path d="M11 16V20H15 M29 16V20H25" />
      </svg>
    ),
    title: "Secrets\nPolicy",
    desc: "Define granular usage rules for individual credentials—restricting target endpoints, HTTP methods, and response behavior. Policies can block unauthorized requests or trigger interactive developer approval. This is credential-level governance built for autonomous agent workflows.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="6" width="24" height="28" rx="3" />
        <circle cx="20" cy="16" r="4" />
        <path d="M12 28C12 24.5 15.5 24 20 24C24.5 24 28 24.5 28 28" />
        <line x1="14" y1="12" x2="26" y2="12" />
      </svg>
    ),
    title: "Agent Identity\n& Capabilities",
    desc: "Bind agents and workflows to unique cryptographic identities. Scope access permissions to specific projects, environments, and credentials. All execution is cryptographically attributed to a verified identity, eliminating the risks of shared wildcard API keys.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 4V36" />
        <path d="M20 12H30" />
        <circle cx="30" cy="12" r="3" fill="currentColor" stroke="none" />
        <path d="M20 20H10" />
        <circle cx="10" cy="20" r="3" fill="currentColor" stroke="none" />
        <path d="M20 28H26" />
        <circle cx="26" cy="28" r="3" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: "Forensic\nAudit Log",
    desc: "Capture immutable snapshots of the complete system state at the millisecond of execution. Logs record the active allowlists, agent capabilities, secrets policies, and specific pipeline decisions. Instantly verify log integrity or replay events for forensic audit.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="8" y1="12" x2="32" y2="12" />
        <line x1="8" y1="20" x2="14" y2="20" />
        <rect x="18" y="17" width="14" height="6" fill="currentColor" stroke="none" />
        <line x1="8" y1="28" x2="32" y2="28" />
      </svg>
    ),
    title: "Response\nRedaction",
    desc: "Prevent credentials from leaking through downstream outputs. If an external API echoes a secret back in its payload, the proxy dynamically redacts it before delivery. The zero-knowledge architecture protects both outbound requests and incoming responses.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="10" r="4" />
        <circle cx="10" cy="28" r="4" />
        <circle cx="30" cy="28" r="4" />
        <path d="M18 13.5L12 24.5 M22 13.5L28 24.5 M14 28H26" />
      </svg>
    ),
    title: "Team\nWorkspaces",
    desc: "Encrypt credentials client-side before cloud synchronization so the server holds only unreadable ciphertext. Onboard developers seamlessly without sharing plaintext credentials over Slack, email, or chat, keeping your configuration files completely zero-disk.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="10" y="16" width="20" height="16" rx="2" />
        <path d="M15 16V11C15 8.2 17.2 6 20 6C22.8 6 25 8.2 25 11V16" />
        <path d="M17 24L19 26L23 22" />
      </svg>
    ),
    title: "Anti-Impersonation\nKeychain Auth",
    desc: "Restrict keychain access using kernel-level process verification, validating parent PIDs, binary paths, and SHA-256 signatures. Unauthorized scripts, background malware, and rogue tooling are blocked from querying credentials even if running on the same host.",
  },
];

export default function FeaturesGrid() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from(gsap.utils.toArray(".feature-card"), {
      opacity: 0,
      y: 40,
      scale: 0.95,
      stagger: 0.1,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        toggleActions: "play none none none"
      }
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      id="features" 
      className="w-full min-h-screen flex items-center justify-center bg-white py-20 px-4 md:px-6 lg:px-8 text-[#1B1B1B] relative z-10 scroll-mt-24"
    >
      <div 
        ref={cardRef}
        className="w-full max-w-[1150px] mx-auto bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-12 lg:p-16 flex flex-col items-center"
      >
        
        <div className="w-full max-w-fit">
          {/* Section Label */}
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase mb-16 opacity-60">
            FEATURES
          </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {features.map((f, i) => {
            const isHovered = hoveredIdx === i;
            
            return (
            <motion.div
              key={f.title}
              className="feature-card flex flex-col cursor-pointer transition-opacity duration-500 ease-out"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              animate={{
                opacity: hoveredIdx !== null && !isHovered ? 0.8 : 1,
                y: isHovered ? -4 : 0
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Abstract SVG Icon */}
              <motion.div 
                style={{ marginBottom: '24px' }}
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? (i === 5 ? 3 : (i % 2 === 0 ? 3 : -3)) : 0,
                  color: isHovered ? '#0d9488' : '#1B1B1B'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                {f.icon}
              </motion.div>
              
              {/* Large Editorial Title */}
              <motion.h3 
                style={{ 
                  fontSize: 'clamp(28px, 2.5vw, 36px)', 
                  lineHeight: '1.1', 
                  fontWeight: 500, 
                  letterSpacing: '-0.03em', 
                  marginBottom: '28px',
                  maxWidth: '95%',
                  minHeight: '2.4em',
                  whiteSpace: 'pre-line'
                }}
                animate={{ color: isHovered ? '#0d9488' : '#1B1B1B' }}
                transition={{ duration: 0.2 }}
              >
                {f.title}
              </motion.h3>
              
              {/* Subtle Description Text */}
              <motion.p 
                style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.65', 
                  maxWidth: '95%'
                }}
                animate={{ color: isHovered ? '#0d9488' : 'rgba(27, 27, 27, 0.7)' }}
                transition={{ duration: 0.2 }}
              >
                {f.desc}
              </motion.p>
            </motion.div>
          )})}
        </div>

        </div>
      </div>
    </section>
  );
}
