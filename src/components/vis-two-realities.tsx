'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VisTwoRealities() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Old Model Refs
  const oldLine1Ref = useRef<HTMLDivElement>(null);
  const oldSecretRef = useRef<HTMLDivElement>(null);
  const oldLine2Ref = useRef<HTMLDivElement>(null);
  const oldWarningRef = useRef<HTMLSpanElement>(null);

  // New Model Refs
  const newLine1Ref = useRef<HTMLDivElement>(null);
  const newSecretRef = useRef<HTMLDivElement>(null);
  const newLine2Ref = useRef<HTMLDivElement>(null);
  const newApiRef = useRef<HTMLDivElement>(null);
  const newSuccessRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'center center',
        end: '+=200%',
        pin: true,
        scrub: 0.5,
      }
    });

    // Step 1: Lines draw down to the secret store
    tl.to([oldLine1Ref.current, newLine1Ref.current], {
      height: '60px',
      duration: 1,
      ease: 'none'
    })
    // Step 2: Secret stores activate
    .to([oldSecretRef.current, newSecretRef.current], {
      opacity: 1,
      scale: 1,
      duration: 0.2
    })
    // Step 3: Old model line draws back UP to agent (simulated by a side line)
    // New model draws DOWN to Target API
    .to(oldLine2Ref.current, {
      height: '60px', 
      duration: 1,
      ease: 'none'
    }, '+=0.2')
    .to(newLine2Ref.current, {
      height: '60px',
      duration: 1,
      ease: 'none'
    }, '<')
    
    // Step 4: Show Target API in new model
    .to(newApiRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.2
    })

    // Step 5: Warnings / Success text
    .to(oldWarningRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '<')
    .to(newSuccessRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '<');

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className='h-screen flex flex-col justify-center items-center bg-[#FAFAFA] relative overflow-hidden'>
      <div className='w-full max-w-[1000px] mx-auto px-6 relative'>
        <h3 className='text-[20px] font-medium text-[#1B1B1B] mb-12 font-poppins text-center'>
          Concept 3: Two Realities
        </h3>

        <div className='flex flex-col md:flex-row h-[500px] border border-[#EBEBED] rounded-2xl bg-white overflow-hidden shadow-xl'>
          
          {/* LEFT: Old Model */}
          <div className='flex-1 flex flex-col items-center pt-10 border-b md:border-b-0 md:border-r border-[#EBEBED] relative bg-[#FAFAFA]/50'>
            <h4 className='text-[13px] font-bold text-[#1B1B1B]/40 mb-8 uppercase tracking-widest'>The Old Model</h4>
            
            <div className='px-5 py-2.5 bg-white border border-[#EBEBED] rounded-md text-[13px] font-mono shadow-sm z-10'>
              Application / Agent
            </div>
            
            {/* Draw Line 1 (Down) */}
            <div className='w-[2px] h-0 bg-[#EBEBED]' ref={oldLine1Ref} />

            {/* Secret Store */}
            <div 
              ref={oldSecretRef}
              className='px-5 py-2.5 bg-[#1B1B1B] text-white rounded-md text-[13px] font-mono opacity-0 scale-95 z-10'
            >
              .env / Secret Manager
            </div>

            {/* Draw Line 2 (Return upward simulation) */}
            <div className='relative flex flex-col items-center'>
               <div className='w-[2px] h-0 bg-[#E53E3E] absolute top-[-60px] -left-8' style={{ transform: 'rotate(180deg)', transformOrigin: 'top' }} ref={oldLine2Ref} />
            </div>
            
            <div 
              ref={oldWarningRef} 
              className='absolute bottom-12 text-[13px] font-medium text-[#E53E3E] opacity-0 translate-y-4 text-center px-8 leading-relaxed'
            >
              The raw secret is returned directly to the Agent's context.<br/>Exposure risk is active.
            </div>
          </div>

          {/* RIGHT: AgentSecrets Model */}
          <div className='flex-1 flex flex-col items-center pt-10 relative bg-white'>
            <h4 className='text-[13px] font-bold text-[#007F6A] mb-8 uppercase tracking-widest'>AgentSecrets</h4>
            
            <div className='px-5 py-2.5 bg-white border border-[#EBEBED] rounded-md text-[13px] font-mono shadow-sm z-10'>
              AI Agent
            </div>
            
            {/* Draw Line 1 (Down) */}
            <div className='w-[2px] h-0 bg-[#00C6A5]' ref={newLine1Ref} />

            {/* AgentSecrets Vault */}
            <div 
              ref={newSecretRef}
              className='px-5 py-2.5 bg-[#005E50] text-white rounded-md text-[13px] font-mono opacity-0 scale-95 shadow-[0_0_20px_rgba(0,127,106,0.2)] z-10'
            >
              AgentSecrets Vault
            </div>

            {/* Draw Line 2 (Goes to Target API) */}
            <div className='w-[2px] h-0 bg-[#00C6A5]' ref={newLine2Ref} />

            <div 
              ref={newApiRef}
              className='px-5 py-2.5 bg-white border border-[#EBEBED] rounded-md text-[13px] font-mono shadow-sm opacity-0 scale-95 z-10'
            >
              Target API
            </div>
            
            <div 
              ref={newSuccessRef} 
              className='absolute bottom-12 text-[13px] font-medium text-[#007F6A] opacity-0 translate-y-4 text-center px-8 leading-relaxed'
            >
              The raw secret never leaves the vault.<br/>Zero exposure risk.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
