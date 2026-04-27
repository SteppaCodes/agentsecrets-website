'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VisCliSimulator() {
  const containerRef = useRef<HTMLElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const xrayContentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !topHalfRef.current || !bottomHalfRef.current || !xrayContentRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'center center',
        end: '+=200%',
        pin: true,
        scrub: 0.5,
      }
    });

    // Animate the split
    tl.to(topHalfRef.current, { y: '-100px', duration: 1 })
      .to(bottomHalfRef.current, { y: '100px', duration: 1 }, '<')
    // Fade in X-Ray content
      .fromTo(xrayContentRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1 }, '-=0.5');

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className='h-screen flex flex-col justify-center items-center bg-[#FAFAFA] relative overflow-hidden'>
      
      <h3 className='absolute top-32 text-[20px] font-medium text-[#1B1B1B]/40 font-poppins text-center w-full z-20 tracking-widest uppercase'>
        Concept 3: CLI Simulator X-Ray
      </h3>

      <div className='relative w-full max-w-[800px] h-[300px] flex items-center justify-center font-mono text-[14px] sm:text-[18px]'>
        
        {/* TOP HALF of the CLI */}
        <div 
          ref={topHalfRef}
          className='absolute top-0 left-0 right-0 h-[50%] flex items-end justify-center overflow-hidden z-20 bg-[#FAFAFA]'
        >
          <div className='px-8 translate-y-[50%] whitespace-nowrap'>
            <span className='text-[#00C6A5] mr-4'>➜</span>
            <span className='text-[#1B1B1B]'>agent deploy --env=prod --auth=</span>
            <span className='text-[#E53E3E]'>sk_live_abc123</span>
          </div>
        </div>

        {/* BOTTOM HALF of the CLI (Masks underneath) */}
        <div 
          ref={bottomHalfRef}
          className='absolute bottom-0 left-0 right-0 h-[50%] z-20 bg-[#FAFAFA] flex items-start justify-center overflow-hidden'
        >
          <div className='px-8 -translate-y-[50%] whitespace-nowrap opacity-0'>
            <span className='text-[#00C6A5] mr-4'>➜</span>
            <span className='text-[#1B1B1B]'>agent deploy --env=prod --auth=</span>
            <span className='text-[#E53E3E]'>sk_live_abc123</span>
          </div>
        </div>

        {/* The Track Line splitting them initially */}
        <div className='absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-[#EBEBED] z-30 opacity-0' />

        {/* The X-RAY Payload (Hidden underneath) */}
        <div 
          ref={xrayContentRef}
          className='absolute top-1/2 left-0 right-0 -translate-y-1/2 flex flex-col items-center justify-center z-10'
        >
          <span className='text-[12px] text-[#007F6A] font-bold tracking-widest uppercase mb-4'>AgentSecrets Intercept</span>
          <div className='px-6 py-4 bg-white border border-[#EBEBED] shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-xl text-[14px] sm:text-[16px] text-[#1B1B1B]'>
            "auth": <span className='text-[#00C6A5] font-bold'>"{'{'}{'{'}vault.stripe_prod{'}'}{'}'}"</span>
          </div>
        </div>

      </div>

    </section>
  );
}
