'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VisPayloadIntercept() {
  const containerRef = useRef<HTMLElement>(null);
  const payloadRef = useRef<HTMLDivElement>(null);
  const payloadTextRef = useRef<HTMLSpanElement>(null);
  const vaultGlowRef = useRef<HTMLDivElement>(null);
  const secureLabelRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !payloadRef.current || !vaultGlowRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'center center',
        end: '+=200%',
        pin: true,
        scrub: 0.5,
      }
    });

    // 1. Move payload from Agent to Vault (center)
    tl.fromTo(payloadRef.current, 
      { left: '10%' },
      { left: '50%', duration: 1, ease: 'none' }
    )
    
    // 2. The Intercept: Pause, pulse glow, and transform text
    .to(vaultGlowRef.current, {
      opacity: 1,
      scale: 1.5,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    })
    .to(payloadRef.current, {
      backgroundColor: '#005E50',
      borderColor: '#005E50',
      color: 'white',
      duration: 0.1
    }, '<')
    .to(payloadTextRef.current, {
      innerHTML: '{ action: "deploy", auth: "AKIAIOSFODNN7..." }', // Real secret injected!
      duration: 0.1
    }, '<')
    .to(secureLabelRef.current, {
      opacity: 1,
      duration: 0.2
    }, '<')

    // 3. Move from Vault to Target API
    .to(payloadRef.current, {
      left: '90%',
      duration: 1,
      ease: 'none'
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className='h-screen flex flex-col justify-center items-center bg-white relative overflow-hidden'>
      <div className='w-full max-w-[1000px] mx-auto px-6 relative'>
        <h3 className='text-[20px] font-medium text-[#1B1B1B] mb-16 font-poppins text-center'>
          Concept 2: The Payload Intercept
        </h3>

        <div className='relative flex justify-between items-center h-[200px]'>
          
          {/* Columns */}
          <div className='flex flex-col items-center z-10 w-[20%]'>
            <span className='text-[14px] font-bold text-[#1B1B1B] mb-4'>The Agent</span>
            <div className='w-3 h-3 rounded-full bg-[#1B1B1B]/20' />
          </div>

          <div className='flex flex-col items-center z-10 w-[20%] relative'>
            <div ref={vaultGlowRef} className='absolute inset-0 bg-[#00C6A5]/20 blur-2xl opacity-0 rounded-full scale-50' />
            <span className='text-[14px] font-bold text-[#007F6A] mb-4'>AgentSecrets</span>
            <div className='w-5 h-5 rounded-full bg-[#007F6A] shadow-[0_0_20px_rgba(0,127,106,0.5)] z-10 flex items-center justify-center'>
              <div className='w-2 h-2 bg-white rounded-full' />
            </div>
          </div>

          <div className='flex flex-col items-center z-10 w-[20%]'>
            <span className='text-[14px] font-bold text-[#1B1B1B] mb-4'>Target API</span>
            <div className='w-3 h-3 rounded-full bg-[#1B1B1B]/20' />
          </div>

          {/* The Track Line */}
          <div className='absolute left-[10%] right-[10%] h-[1px] bg-[#EBEBED] top-[calc(50%+16px)] -translate-y-1/2 z-0 border-dashed border-t border-[#1B1B1B]/20' />

          {/* The Moving Payload */}
          <div 
            ref={payloadRef}
            className='absolute top-[calc(50%+16px)] -translate-y-1/2 -translate-x-1/2 px-5 py-2.5 bg-[#FAFAFA] border border-[#EBEBED] rounded-lg shadow-xl z-20 whitespace-nowrap transition-colors duration-200 text-[#1B1B1B] flex flex-col items-center'
            style={{ left: '10%' }}
          >
            <span 
              ref={secureLabelRef}
              className='absolute -top-6 text-[10px] font-bold text-[#00C6A5] uppercase tracking-wider opacity-0'
            >
              Secret Injected
            </span>
            <span ref={payloadTextRef} className='text-[12px] font-mono'>
              {'{ action: "deploy", auth: "{{vault.aws}}" }'}
            </span>
          </div>

        </div>
        
        <p className='text-center text-[#666] mt-16 text-[14px] max-w-[600px] mx-auto leading-relaxed'>
          The Agent never sees the real credential. It sends a vault reference. AgentSecrets intercepts the payload, injects the real credential on the fly, and forwards it to the Target API.
        </p>

      </div>
    </section>
  );
}
