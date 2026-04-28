'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORKFLOW_STEPS = [
  {
    label: "Store Credentials",
    cmd: "$ agentsecrets secrets set OPENAI_API_KEY=sk_...",
    output: "Encrypted locally. Stored in zero-knowledge vault."
  },
  {
    label: "Sync Environments",
    cmd: "$ agentsecrets secrets pull",
    output: "Synced 3 secrets from cloud to OS keychain."
  },
  {
    label: "Detect Drift",
    cmd: "$ agentsecrets secrets diff",
    output: "Only local:   NEW_KEY\nOnly remote:  DEPRECATED_KEY\nDiffers:      DATABASE_URL"
  },
  {
    label: "Switch Environments",
    cmd: "$ agentsecrets environment switch production",
    output: "Switched to production."
  },
  {
    label: "Execute Calls",
    cmd: "$ agentsecrets call --url api.stripe.com/v1/balance --bearer STRIPE_KEY",
    output: '{"object":"balance","available":[{"amount":420000,"currency":"usd"}]}'
  },
  {
    label: "Audit Logs",
    cmd: "$ agentsecrets proxy logs --watch",
    output: "14:23:01  GET  api.stripe.com/v1/balance  STRIPE_KEY  200  245ms"
  },
];

const CIRCLE_ITEMS = WORKFLOW_STEPS;

export default function VisWorkflowWheel() {
  const containerRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    if (glow1Ref.current) {
      gsap.to(glow1Ref.current, {
        yPercent: 10,
        xPercent: 5,
        scale: 1.1,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
    if (glow2Ref.current) {
      gsap.to(glow2Ref.current, {
        yPercent: -15,
        xPercent: -10,
        scale: 1.2,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2
      });
    }

    let radius = window.innerHeight * 0.9; 
    if (window.innerWidth < 768) radius = window.innerHeight * 0.6;
    
    let centerX = (window.innerWidth * 0.10) - radius;

    gsap.set(wrapperRef.current, { left: centerX, top: '50%' });

    const updateItemsPosition = (scrollProgress: number) => {
      const spacing = Math.PI / 18; 
      const maxRotation = (CIRCLE_ITEMS.length - 1) * spacing;

      let closestIndex = 0;
      let minDistance = Infinity;

      CIRCLE_ITEMS.forEach((_, index) => {
        const item = itemsRef.current[index];
        if (!item) return;

        const angle = (index * spacing) - (scrollProgress * maxRotation);
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const rotation = (angle * 180) / Math.PI;

        const distanceToZero = Math.abs(angle);

        if (distanceToZero < minDistance) {
          minDistance = distanceToZero;
          closestIndex = index;
        }

        let opacity = 0;
        let color = '#FFFFFF';
        let textShadow = 'none';

        const isAbove = angle < 0;
        const targetLowOpacity = isAbove ? 0.35 : 0.08;

        if (distanceToZero < 0.05) {
          opacity = 1;
          const depthProgress = distanceToZero / 0.05;
          const blurAmount = Math.round((1 - depthProgress) * 25);
          const alphaAmount = (1 - depthProgress) * 0.6;
          textShadow = `0 0 ${blurAmount}px rgba(255,255,255,${alphaAmount})`;
        } else if (distanceToZero < 0.15) {
          const dropProgress = (distanceToZero - 0.05) / 0.10;
          opacity = 1 - (dropProgress * (1 - targetLowOpacity)); 
        } else if (distanceToZero < 0.8) {
          const fadeProgress = (distanceToZero - 0.15) / 0.65;
          opacity = targetLowOpacity * (1 - fadeProgress);
        } else {
          opacity = 0;
        }

        gsap.set(item, {
          x,
          y,
          xPercent: 0, 
          yPercent: -50,
          rotation,
          opacity,
          color,
          textShadow,
          transformOrigin: "left center",
        });
      });

      WORKFLOW_STEPS.forEach((_, i) => {
        if (contentRefs.current[i]) {
          const isActive = i === closestIndex;
          gsap.set(contentRefs.current[i], {
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : 20,
            pointerEvents: isActive ? 'auto' : 'none',
          });
        }
      });
    };

    updateItemsPosition(0);

    // Pin the visualization and animate the wheel
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=300%', // Increased duration to allow for the curtain reveal phase
      pin: true,
      pinSpacing: false, // Essential: we will manage spacing manually in the parent
      scrub: 1,
      onUpdate: (self) => {
        // Animation finishes at 66% of the total scroll (approx 200vh)
        const animationProgress = Math.min(self.progress / 0.66, 1);
        updateItemsPosition(animationProgress);
      },
    });

    const handleResize = () => {
      radius = window.innerHeight * 0.9;
      if (window.innerWidth < 768) radius = window.innerHeight * 0.6;
      centerX = (window.innerWidth * 0.10) - radius;
      gsap.set(wrapperRef.current, { left: centerX });
      ScrollTrigger.update();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className='h-screen w-full flex items-center justify-center relative overflow-hidden z-0'
      style={{ backgroundColor: '#0D1512', color: '#FFFFFF' }}
    >
      <div ref={glow1Ref} className='absolute left-[5%] top-[40%] w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-[100px] pointer-events-none z-0 will-change-transform' />
      <div ref={glow2Ref} className='absolute right-0 bottom-0 w-[400px] h-[400px] translate-x-1/4 rounded-full bg-white/15 blur-[90px] pointer-events-none z-0 will-change-transform' />

      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.2] mix-blend-overlay" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />

      <div className='w-full max-w-[1600px] mx-auto flex items-center justify-between h-full relative z-10'>
        <div 
          ref={wrapperRef}
          className='absolute top-1/2' 
          style={{ transform: 'translate(0, -50%)' }}
        >
          {CIRCLE_ITEMS.map((step, i) => (
            <div
              key={i}
              ref={el => { itemsRef.current[i] = el; }}
              className='absolute font-medium tracking-tight whitespace-nowrap will-change-transform'
              style={{ 
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontSize: 'clamp(30px, 4vw, 60px)',
                lineHeight: '1.1',
              }}
            >
              {step.label}
            </div>
          ))}
        </div>

        <div className='absolute right-6 md:right-12 lg:right-24 top-1/2 -translate-y-1/2 w-full max-w-[500px] h-[250px] z-20 pointer-events-none'>
          {WORKFLOW_STEPS.map((step, i) => (
            <div
              key={i}
              ref={el => { contentRefs.current[i] = el; }}
              className='absolute inset-0 flex flex-col justify-center transition-all duration-300'
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <div className='font-mono text-[15px] leading-relaxed'>
                <div className='text-[#34D399] mb-2 font-medium'>{step.cmd}</div>
                <div className='text-white/70 whitespace-pre-wrap'>{step.output}</div>
              </div>

              <p className='mt-8 text-[14px] text-white/50 leading-relaxed font-mono max-w-[400px]'>
                {i === WORKFLOW_STEPS.length - 1 
                  ? "The agent managed the complete workflow autonomously. No credential value appeared at any step."
                  : "Executing autonomous lifecycle management without context exposure."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
