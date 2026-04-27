'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VisAbstractStack() {
  const containerRef = useRef<HTMLElement>(null);
  const payloadRef = useRef<HTMLDivElement>(null);
  const vaultRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !payloadRef.current || !vaultRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'center center',
        end: '+=200%',
        pin: true,
        scrub: 0.5,
      }
    });

    // Move payload down from AGENT to AGENTSECRETS
    tl.to(payloadRef.current, { top: '50%', duration: 1, ease: 'power1.in' })
      
    // Transform at vault
      .to(vaultRef.current, { color: '#00C6A5', scale: 1.02, duration: 0.2, yoyo: true, repeat: 1 })
      .to(payloadRef.current, { 
        backgroundColor: '#00C6A5', 
        scale: 0.5, 
        boxShadow: '0 0 30px 10px rgba(0,198,165,0.4)',
        duration: 0.2 
      }, '<')

    // Move to API
      .to(payloadRef.current, { top: '90%', duration: 1, ease: 'power1.out' });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className='h-screen flex flex-col justify-center items-center bg-white relative overflow-hidden'>
      
      <h3 className='absolute top-32 text-[20px] font-medium text-[#1B1B1B]/40 font-poppins text-center w-full z-20 tracking-widest uppercase'>
        Concept 4: Abstract Stack
      </h3>

      <div className='relative flex flex-col items-center justify-between h-[60vh] w-full font-poppins font-black text-[clamp(50px,10vw,140px)] tracking-tighter leading-none uppercase text-center'>
        
        {/* Layer 1 */}
        <div className='z-10 text-[#EBEBED] w-full text-center'>Agent</div>
        
        {/* Layer 2 */}
        <div ref={vaultRef} className='z-10 text-[#1B1B1B] transition-colors w-full text-center'>AgentSecrets</div>
        
        {/* Layer 3 */}
        <div className='z-10 text-[#EBEBED] w-full text-center'>Target API</div>

        {/* The Payload */}
        <div 
          ref={payloadRef}
          className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] rounded-full bg-[#E53E3E] z-20 shadow-[0_0_20px_5px_rgba(229,62,62,0.3)]'
          style={{ top: '10%' }}
        />

      </div>

    </section>
  );
}
