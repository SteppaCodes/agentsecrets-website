'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORKFLOW_STEPS = [
  {
    label: "Store Credentials",
    cmd: "$ agentsecrets secrets set OPENAI_API_KEY",
    output: "Encrypted locally. Stored in zero-knowledge vault."
  },
  {
    label: "Sync Environments",
    cmd: "$ agentsecrets sync --env production",
    output: "Synced 14 encrypted variables to agent context. Zero-knowledge verified."
  },
  {
    label: "Detect Drift",
    cmd: "$ agentsecrets secrets diff",
    output: "OUT OF SYNC: STRIPE_KEY (remote is newer)"
  },
  {
    label: "Switch Environments",
    cmd: "$ agentsecrets env use staging",
    output: "Switched to staging context. Injecting 8 variables."
  },
  {
    label: "Execute Calls",
    cmd: "$ agentsecrets call --bearer STRIPE_KEY",
    output: '{"object":"balance","available":[{"amount":420000,"currency":"usd"}]}'
  },
  {
    label: "Audit Logs",
    cmd: "$ agentsecrets audit --tail",
    output: "[14:02:01] Agent accessed STRIPE_KEY. Context isolated."
  },
];

const CIRCLE_ITEMS = WORKFLOW_STEPS;

export default function VisWorkflowWheel() {
  const containerRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    let radius = window.innerHeight * 0.9; 
    if (window.innerWidth < 768) radius = window.innerHeight * 0.6;
    
    // Pushed further to the left per user request (10% of screen width)
    let centerX = (window.innerWidth * 0.10) - radius;

    gsap.set(wrapperRef.current, { left: centerX, top: '50%' });

    const updateItemsPosition = (scrollProgress: number) => {
      // Hardcode a very tight angle between the steps (10 degrees)
      const spacing = Math.PI / 18; 
      // The total rotation needed to bring the last item to angle 0
      const maxRotation = (CIRCLE_ITEMS.length - 1) * spacing;

      let closestIndex = 0;
      let minDistance = Infinity;

      CIRCLE_ITEMS.forEach((_, index) => {
        const item = itemsRef.current[index];
        if (!item) return;

        // Simple linear interpolation
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

        // Strict spotlight, but with a SMOOTH fade out (no cliffs)
        if (distanceToZero < 0.08) {
          opacity = 1; // Dead center is fully bright
        } else if (distanceToZero < 0.6) {
          // Others fade down smoothly from 1.0 down to 0.15
          const progress = (distanceToZero - 0.08) / 0.52; 
          opacity = 1 - (progress * 0.85); 
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

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=200%', // Reduced from 400% since it's only 4 items now
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        updateItemsPosition(self.progress);
      },
    });

    const handleResize = () => {
      radius = window.innerHeight * 0.9;
      if (window.innerWidth < 768) radius = window.innerHeight * 0.6;
      centerX = (window.innerWidth * 0.2) - radius;
      gsap.set(wrapperRef.current, { left: centerX });
      ScrollTrigger.update();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className='h-screen w-full bg-[#1b1b1b] text-[#EBEBED] flex items-center justify-center relative overflow-hidden'>
      
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none' />

      <div className='w-full max-w-[1600px] mx-auto flex items-center justify-between h-full relative'>
        
        {/* LEFT SIDE: The Math Circle Wrapper */}
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

        {/* RIGHT SIDE: Raw Commands */}
        <div className='absolute right-6 md:right-12 lg:right-24 top-1/2 -translate-y-1/2 w-full max-w-[500px] h-[250px] z-20 pointer-events-none'>
          {WORKFLOW_STEPS.map((step, i) => (
            <div
              key={i}
              ref={el => { contentRefs.current[i] = el; }}
              className='absolute inset-0 flex flex-col justify-center transition-all duration-300'
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <div className='font-mono text-[15px] leading-relaxed'>
                <div className='text-[#00C6A5] mb-2 font-medium'>{step.cmd}</div>
                <div className='text-white/70'>{step.output}</div>
              </div>

              <p className='mt-8 text-[14px] text-white/40 leading-relaxed font-mono max-w-[400px]'>
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
