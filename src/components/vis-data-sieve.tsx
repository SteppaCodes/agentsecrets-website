'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VisDataSieve() {
  const containerRef = useRef<HTMLElement>(null);
  const safeStreamRef = useRef<HTMLDivElement>(null);
  const unsafeStreamRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!containerRef.current || !safeStreamRef.current || !unsafeStreamRef.current) return;

    // Pin the container and scroll the text stream UP
    gsap.to([safeStreamRef.current, unsafeStreamRef.current], {
      y: '-100vh', // Move the text streams up
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'center center',
        end: '+=250%', // pin for 2.5x screen height
        pin: true,
        scrub: 0.5,
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className='h-screen flex flex-col items-center bg-[#050505] relative overflow-hidden'>
      
      <h3 className='absolute top-32 text-[20px] font-medium text-white/50 font-poppins text-center w-full z-20 tracking-widest uppercase'>
        Concept 1: The Firewall Sieve
      </h3>

      {/* The Central Glowing Firewall Line */}
      <div className='absolute top-1/2 left-0 right-0 h-[1px] bg-[#00C6A5] shadow-[0_0_30px_2px_rgba(0,198,165,0.6)] z-30' />
      <div className='absolute top-1/2 left-0 right-0 h-[40vh] bg-gradient-to-b from-[#00C6A5]/10 to-transparent pointer-events-none z-20' />

      {/* SAFE ZONE (Top Half of Screen) */}
      <div className='absolute inset-0 z-10 pointer-events-none' style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}>
        <div 
          ref={safeStreamRef}
          className='absolute w-full max-w-[800px] left-1/2 -translate-x-1/2 flex flex-col font-mono text-[16px] md:text-[24px] leading-[2.5] tracking-wide text-white/80'
          style={{ top: '80vh' }}
        >
          {/* SAFE TEXT */}
          <span>[SYSTEM] Connecting to cluster...</span>
          <span>[AUTH] Agent identified: ag_932</span>
          <span>[ACTION] Requesting database backup</span>
          <span>
            [PAYLOAD] &#123; db_url: <span className='text-[#00C6A5] font-bold'>'&#123;&#123;vault.prod_db_url&#125;&#125;'</span> &#125;
          </span>
          <span>[NETWORK] Routing through secure tunnel...</span>
          <span>[SYSTEM] Backup initiated successfully.</span>
        </div>
      </div>

      {/* UNSAFE ZONE (Bottom Half of Screen) */}
      <div className='absolute inset-0 z-10 pointer-events-none' style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}>
        <div 
          ref={unsafeStreamRef}
          className='absolute w-full max-w-[800px] left-1/2 -translate-x-1/2 flex flex-col font-mono text-[16px] md:text-[24px] leading-[2.5] tracking-wide text-[#666]'
          style={{ top: '80vh' }}
        >
          {/* UNSAFE TEXT (Exact same lines, but red exposed secret) */}
          <span>[SYSTEM] Connecting to cluster...</span>
          <span>[AUTH] Agent identified: ag_932</span>
          <span>[ACTION] Requesting database backup</span>
          <span>
            [PAYLOAD] &#123; db_url: <span className='text-[#E53E3E] font-bold'>'postgres://admin:superSecretPass@db.aws.com:5432'</span> &#125;
          </span>
          <span>[NETWORK] Routing through secure tunnel...</span>
          <span>[SYSTEM] Backup initiated successfully.</span>
        </div>
      </div>
    </section>
  );
}
