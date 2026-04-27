'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VisStepTypography() {
  const containerRef = useRef<HTMLElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'center center',
        end: '+=400%', // longer pin for 4 steps
        pin: true,
        scrub: 0.5,
      }
    });

    // Step 1 to 2
    tl.to(step1Ref.current, { opacity: 0, y: -40, duration: 1, ease: 'power2.inOut' })
      .fromTo(step2Ref.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.inOut' }, '<')
      .to({}, { duration: 0.5 }) // pause
      
    // Step 2 to 3
      .to(step2Ref.current, { opacity: 0, y: -40, duration: 1, ease: 'power2.inOut' })
      .fromTo(step3Ref.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.inOut' }, '<')
      .to({}, { duration: 0.5 })
      
    // Step 3 to 4
      .to(step3Ref.current, { opacity: 0, y: -40, duration: 1, ease: 'power2.inOut' })
      .fromTo(step4Ref.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.inOut' }, '<');

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className='h-screen flex flex-col justify-center items-center bg-white relative overflow-hidden'>
      <h3 className='absolute top-32 text-[20px] font-medium text-[#1B1B1B] font-poppins text-center w-full z-10'>
        Concept 4: Step-by-Step Typography
      </h3>

      <div className='w-full max-w-[800px] mx-auto px-6 relative h-[300px] flex justify-center items-center'>

        {/* Step 1 */}
        <div ref={step1Ref} className='absolute text-center flex flex-col items-center gap-8 w-full'>
          <span className='text-[24px] sm:text-[32px] font-medium text-[#1B1B1B] tracking-tight'>
            1. Agent requests an action
          </span>
          <div className='px-8 py-4 bg-[#FAFAFA] border border-[#EBEBED] rounded-xl text-[14px] sm:text-[16px] font-mono shadow-sm'>
            agent.execute("deploy_to_vercel")
          </div>
        </div>

        {/* Step 2 */}
        <div ref={step2Ref} className='absolute text-center flex flex-col items-center gap-8 w-full opacity-0'>
          <span className='text-[24px] sm:text-[32px] font-medium text-[#007F6A] tracking-tight'>
            2. AgentSecrets intercepts
          </span>
          <div className='px-8 py-4 bg-white border-2 border-[#00C6A5] rounded-xl text-[14px] sm:text-[16px] font-mono shadow-[0_0_30px_rgba(0,198,165,0.2)] text-[#007F6A]'>
            intercepting payload...
          </div>
        </div>

        {/* Step 3 */}
        <div ref={step3Ref} className='absolute text-center flex flex-col items-center gap-8 w-full opacity-0'>
          <span className='text-[24px] sm:text-[32px] font-medium text-[#1B1B1B] tracking-tight'>
            3. Secrets injected at runtime
          </span>
          <div className='px-8 py-4 bg-[#005E50] text-white rounded-xl text-[14px] sm:text-[16px] font-mono shadow-xl'>
            injecting: <span className='tracking-widest'>********</span>
          </div>
        </div>

        {/* Step 4 */}
        <div ref={step4Ref} className='absolute text-center flex flex-col items-center gap-8 w-full opacity-0'>
          <span className='text-[24px] sm:text-[32px] font-medium text-[#1B1B1B] tracking-tight'>
            4. Agent gets the result.<br/>Not the secret.
          </span>
          <div className='px-8 py-4 bg-[#FAFAFA] border border-[#EBEBED] rounded-xl text-[14px] sm:text-[16px] font-mono shadow-sm text-[#007F6A]'>
            {'{ status: "success", deployment_url: "..." }'}
          </div>
        </div>

      </div>
    </section>
  );
}
