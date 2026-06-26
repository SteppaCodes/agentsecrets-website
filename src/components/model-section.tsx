'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GAPS = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="20,4 34,12 34,28 20,36 6,28 6,12" />
        <circle cx="20" cy="20" r="3" fill="currentColor" stroke="none" />
        <path d="M20 4V17 M34 12L22.5 18.5 M34 28L22.5 21.5 M20 36V23 M6 28L17.5 21.5 M6 12L17.5 18.5" />
      </svg>
    ),
    title: 'Context\nExposure',
    desc: 'Every traditional secret manager hands the plaintext value to the requesting process. For an AI agent, process memory and environment variables are part of its context window. The moment a credential enters that space, it is reachable by prompt injection.',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="6" width="24" height="28" rx="3" />
        <circle cx="20" cy="16" r="4" />
        <path d="M12 28C12 24.5 15.5 24 20 24C24.5 24 28 24.5 28 28" />
      </svg>
    ),
    title: 'Anonymous\nExecution',
    desc: 'When every agent call looks identical, there is no way to trace which agent accessed which credential, when, or why. Compromise investigations become guesswork, and shared keys cannot be revoked per-agent without breaking every workflow.',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="6" y="6" width="28" height="28" rx="3" />
        <path d="M6 14H34 M14 14V34" />
        <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: 'Disk-Bound\nCredentials',
    desc: '.env files and environment injection write plaintext credentials to disk or process memory, where AI agents with file-reading tools can access them on instruction. There is no boundary between the agent\'s capabilities and the keys it can read.',
  },
];

const PILLARS = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="20,4 34,12 34,28 20,36 6,28 6,12" />
        <path d="M12 20L18 26L28 14" />
      </svg>
    ),
    title: 'Zero-knowledge\nby-reference execution',
    desc: 'Agents never hold plaintext credentials. Every request uses a key reference resolved by the infrastructure at the transport layer, outside the agent\'s accessible context.',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="14" width="24" height="20" rx="3" />
        <path d="M15 14V10C15 7.2 17.2 5 20 5C22.8 5 25 7.2 25 10V14" />
        <circle cx="20" cy="23" r="3" fill="currentColor" stroke="none" />
        <path d="M20 26V30" strokeLinecap="round" />
      </svg>
    ),
    title: 'Kernel-verified\ntransport injection',
    desc: 'The keychain-auth daemon verifies the calling process before release. Credentials are injected at the network transport layer — never into agent memory, environment, or context.',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="12" r="5" />
        <path d="M10 34C10 28 14 24 20 24C26 24 30 28 30 34" />
        <path d="M30 8L34 12L30 16" />
        <path d="M34 12H26" />
      </svg>
    ),
    title: 'Cryptographic\nagent identity',
    desc: 'Every credential resolution is linked to a specific agent token. Full audit trail with per-agent revocation — no shared keys, no blind spots in incident response.',
  },
];

export default function ModelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const problemLabelRef = useRef<HTMLSpanElement>(null);
  const problemBodyRef = useRef<HTMLDivElement>(null);
  const modelLabelRef = useRef<HTMLSpanElement>(null);
  const modelBodyRef = useRef<HTMLDivElement>(null);
  const [hoveredGap, setHoveredGap] = useState<number | null>(null);
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Problem label
    gsap.from(problemLabelRef.current, {
      opacity: 0, y: 16, duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: problemLabelRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' },
    });

    // Problem body — scrub opacity
    if (problemBodyRef.current) {
      const blocks = Array.from(problemBodyRef.current.querySelectorAll('.reveal-block'));
      blocks.forEach((el) => {
        gsap.set(el, { opacity: 0.15 });
        gsap.to(el, {
          opacity: 1, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 50%', scrub: true },
        });
      });
    }

    // Model label
    gsap.from(modelLabelRef.current, {
      opacity: 0, y: 16, duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: modelLabelRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' },
    });

    // Model body — scrub opacity
    if (modelBodyRef.current) {
      const blocks = Array.from(modelBodyRef.current.querySelectorAll('.reveal-block'));
      blocks.forEach((el) => {
        gsap.set(el, { opacity: 0.15 });
        gsap.to(el, {
          opacity: 1, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 50%', scrub: true },
        });
      });
    }

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id='model'
      className='flex flex-col items-center bg-white pt-[10vh] md:pt-[15vh] pb-16 md:pb-[120px] scroll-mt-24'
      style={{ paddingRight: 'clamp(16px, 5vw, 100px)', paddingLeft: 'clamp(16px, 5vw, 100px)' }}
    >
      <div className='w-full max-w-[1200px] mx-auto flex flex-col items-center'>

        {/* ─── THE PROBLEM ─── */}
        <div className='w-full max-w-[820px]'>
          <span
            ref={problemLabelRef}
            className='block text-[13px] font-medium tracking-wide text-[#007F6A] font-poppins mb-8 text-left'
          >
            THE PROBLEM
          </span>

          <div ref={problemBodyRef} className='text-left'>
            {/* Original dramatic prose */}
            <p className='reveal-block text-[clamp(18px,1.5vw,24px)] font-normal leading-[1.65] tracking-[-0.01em] text-[#1B1B1B]'>
              Credentials are the backbone of the modern world. Every system runs on credentials. Databases, APIs, infrastructures. Credentials are more than just values, they are the invisible layer of authority that decides what software can access, what actions it can perform, and where its power ends.
            </p>
            <div className='h-8' />
            <p className='reveal-block text-[clamp(18px,1.5vw,24px)] font-normal leading-[1.65] tracking-[-0.01em] text-[#1B1B1B]'>
              For decades, we've built systems around controlling how humans and applications use this authority. But AI agents changed the equation.
            </p>
            <div className='h-8' />
            <p className='reveal-block text-[clamp(18px,1.5vw,24px)] font-normal leading-[1.65] tracking-[-0.01em] text-[#1B1B1B]'>
              Agents are no longer just executing predefined instructions. They reason, act, call tools, and make decisions on our behalf. And their capabilities are directly tied to the credentials they can access: an agent is only as powerful as the credentials it possesses.
            </p>
            <div className='h-8' />
            <p className='reveal-block text-[clamp(18px,1.5vw,24px)] font-normal leading-[1.65] tracking-[-0.01em] text-[#1B1B1B]'>
              The world gave AI agents autonomy, but the credential layer never evolved. AgentSecrets exists to fix that.
            </p>
            <div className='h-8' />
            <p className='reveal-block text-[clamp(18px,1.5vw,24px)] font-normal leading-[1.65] tracking-[-0.01em] text-[#1B1B1B]'>
              The missing security layer for autonomous software: controlling what agents can access, when they can access it, and how that authority is used.
            </p>
          </div>
        </div>

        {/* Breathing room between text and threat cards */}
        <div className='h-20 md:h-28' />

        {/* Gap cards — 3 columns */}
        <div className='w-full max-w-[820px]'>
          <div className='reveal-block grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16'>
            {GAPS.map((t, i) => {
              const isHovered = hoveredGap === i;
              return (
              <motion.div
                key={t.title}
                className='flex flex-col cursor-pointer'
                onMouseEnter={() => setHoveredGap(i)}
                onMouseLeave={() => setHoveredGap(null)}
                animate={{
                  opacity: hoveredGap !== null && !isHovered ? 0.8 : 1,
                  y: isHovered ? -4 : 0
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <motion.div
                  style={{ marginBottom: '24px' }}
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    rotate: isHovered ? (i % 2 === 0 ? 3 : -3) : 0,
                    color: isHovered ? '#0d9488' : '#1B1B1B'
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {t.icon}
                </motion.div>
                <motion.h3
                  style={{
                    fontSize: 'clamp(28px, 2.5vw, 36px)',
                    lineHeight: '1.1',
                    fontWeight: 500,
                    letterSpacing: '-0.03em',
                    marginBottom: '28px',
                    whiteSpace: 'pre-line',
                    maxWidth: '95%',
                    minHeight: '2.4em'
                  }}
                  animate={{ color: isHovered ? '#0d9488' : '#1B1B1B' }}
                  transition={{ duration: 0.2 }}
                >
                  {t.title}
                </motion.h3>
                <motion.p
                  style={{ fontSize: '14px', lineHeight: '1.65', maxWidth: '95%' }}
                  animate={{ color: isHovered ? '#0d9488' : 'rgba(27, 27, 27, 0.7)' }}
                  transition={{ duration: 0.2 }}
                >
                  {t.desc}
                </motion.p>
              </motion.div>
            )})}
          </div>
        </div>

        {/* Gap between THE PROBLEM and THE MODEL */}
        <div className='h-28 md:h-40' />

        {/* ─── THE MODEL ─── */}
        <div className='w-full max-w-[820px]'>
          <span
            ref={modelLabelRef}
            className='block text-[13px] font-medium tracking-wide text-[#007F6A] font-poppins mb-8 text-left'
          >
            THE MODEL
          </span>

          <div ref={modelBodyRef} className='text-left'>
            {/* Headline + right description */}
            <div className='reveal-block flex flex-col md:flex-row md:items-start md:justify-between gap-8'>
              <h2
                className='text-[clamp(22px,2.4vw,36px)] leading-[1.2] tracking-[-0.02em] text-[#1B1B1B] font-semibold max-w-[420px]'
                style={{ fontFamily: 'var(--font-helvetica), sans-serif' }}
              >
                Zero-knowledge runtime: the agent holds references, the infrastructure holds the keys.
              </h2>
              <p className='text-[13px] md:text-[14px] leading-[1.65] text-[#1B1B1B]/50 max-w-[260px] md:text-right md:pt-1'>
                Credentials are resolved inside the trusted proxy boundary and injected at the transport layer. The agent never sees the raw value.
              </p>
            </div>
          </div>
        </div>

        {/* Breathing room between model text and step cards */}
        <div className='h-16 md:h-20' />

        {/* Pillar cards — same style as gaps */}
        <div className='w-full max-w-[820px]'>
          <div className='reveal-block grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16'>
            {PILLARS.map((p, i) => {
              const isHovered = hoveredPillar === i;
              return (
              <motion.div
                key={p.title}
                className='flex flex-col cursor-pointer'
                onMouseEnter={() => setHoveredPillar(i)}
                onMouseLeave={() => setHoveredPillar(null)}
                animate={{
                  opacity: hoveredPillar !== null && !isHovered ? 0.8 : 1,
                  y: isHovered ? -4 : 0
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <motion.div
                  style={{ marginBottom: '24px' }}
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    rotate: isHovered ? (i % 2 === 0 ? 3 : -3) : 0,
                    color: isHovered ? '#0d9488' : '#1B1B1B'
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {p.icon}
                </motion.div>
                <motion.h3
                  style={{
                    fontSize: 'clamp(28px, 2.5vw, 36px)',
                    lineHeight: '1.1',
                    fontWeight: 500,
                    letterSpacing: '-0.03em',
                    marginBottom: '28px',
                    whiteSpace: 'pre-line',
                    maxWidth: '95%',
                    minHeight: '2.4em'
                  }}
                  animate={{ color: isHovered ? '#0d9488' : '#1B1B1B' }}
                  transition={{ duration: 0.2 }}
                >
                  {p.title}
                </motion.h3>
                <motion.p
                  style={{ fontSize: '14px', lineHeight: '1.65', maxWidth: '95%' }}
                  animate={{ color: isHovered ? '#0d9488' : 'rgba(27, 27, 27, 0.7)' }}
                  transition={{ duration: 0.2 }}
                >
                  {p.desc}
                </motion.p>
              </motion.div>
            )})}
          </div>
        </div>

      </div>
    </section>
  );
}
