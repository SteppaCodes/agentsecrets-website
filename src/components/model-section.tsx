'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function ModelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !bodyRef.current) return;

    // Label — subtle fade up on scroll
    gsap.from(labelRef.current, {
      opacity: 0,
      y: 16,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: labelRef.current,
        start: 'top 85%',
        toggleActions: 'play reverse play reverse',
      },
    });

    const paragraphs = Array.from(bodyRef.current.querySelectorAll('p'));

    const introParagraphs = paragraphs.slice(0, 3);
    const highlightParagraphs = paragraphs.slice(3);

    // First three paragraphs fade in normally with the section
    gsap.from(introParagraphs, {
      opacity: 0,
      y: 20,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bodyRef.current,
        start: 'top 80%',
        toggleActions: 'play reverse play reverse',
      },
    });

    // Last two paragraphs start dimmed and highlight line-by-line on scroll
    highlightParagraphs.forEach((p) => {
      const split = SplitText.create(p, {
        type: 'lines',
        linesClass: 'model-line',
      });

      // Start "a little invisible" so it doesn't overwhelm the reader
      gsap.set(split.lines, { opacity: 0.25 });

      // Highlight line-by-line as they scroll to it
      gsap.to(split.lines, {
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: p,
          start: 'top 75%',
          toggleActions: 'play reverse play reverse',
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id='model'
      className='min-h-screen flex flex-col justify-center items-center bg-white'
      style={{ padding: '120px clamp(32px, 5vw, 100px)', paddingLeft: 'clamp(80px, 15vw, 280px)' }}
    >
      <div className='w-full max-w-[1200px] mx-auto'>

        {/* Section Label */}
        <span
          ref={labelRef}
          className='block text-[13px] font-medium tracking-wide text-[#007F6A] font-poppins mb-8'
        >
          MODEL
        </span>

        {/* Body Text */}
        <div
          ref={bodyRef}
          className='text-[clamp(16px,1.2vw,19px)] font-normal leading-[1.6] tracking-[-0.01em] text-[#1B1B1B] max-w-[820px]'
        >
          <p className="mb-10">
            Every secrets tool built before the agentic era was designed around the same assumption: the application is trusted.
          </p>
          <p className="mb-10">
            Store the credential securely, retrieve it at runtime, use it. That model worked because applications do exactly what their code says. They cannot be redirected by a malicious instruction embedded in a document they process. The assumption of trust was reasonable, and the infrastructure built on it reflects that.
          </p>
          <br />

          <p className="mb-10">
            AI agents are not applications. The coding assistant reading your codebase right now can also read your .env file. The agent you are deploying into production processes untrusted content and acts on what it finds. In both cases, the moment a credential value exists anywhere in the agent's context — in memory, in a file it can access, in an environment it can read — the old model's job is done and the exposure has already begun.
          </p>
          <br />
          <p className="mb-10">
            The developers who feel this most acutely are building the most capable agents and working with the most powerful AI assistants. The more the agent can do, the more it matters where the credential lives when it does it.
          </p>
          <br />
          <p>
            AgentSecrets is built around a new model for the AI-agent era. The agent manages the full credentials lifecycle — storing secrets, syncing across environments and teams, detecting drift, switching environments, auditing every call — without the credential value ever entering its context. Whether you are shipping an autonomous agent or building with an AI coding assistant, the agent operates credentials it was never given. The work gets done. The value was never there to take.
          </p>
        </div>

      </div>
    </section>
  );
}
