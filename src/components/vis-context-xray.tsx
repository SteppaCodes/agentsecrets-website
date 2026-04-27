'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VisContextXray() {
  const containerRef = useRef<HTMLElement>(null);
  const safeLayerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !safeLayerRef.current || !lensRef.current) return;

    // Pin the container and animate the clip-path / lens position
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'center center',
        end: '+=150%', // pin for 1.5x screen height
        pin: true,
        scrub: 0.5, // smooth scrubbing
      }
    });

    // Animate lens moving left to right
    tl.to(lensRef.current, {
      left: '100%',
      ease: 'none'
    }, 0);

    // Animate safe layer clip-path expanding left to right
    // inset(top right bottom left)
    tl.fromTo(safeLayerRef.current, 
      { clipPath: 'inset(0% 100% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' },
      0
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className='h-screen flex flex-col justify-center items-center bg-white relative overflow-hidden'>
      <div className='w-full max-w-[900px] mx-auto px-6 relative'>
        
        <h3 className='text-[20px] font-medium text-[#1B1B1B] mb-8 font-poppins text-center'>
          Concept 1: The Context X-Ray Lens
        </h3>

        <div className='relative w-full rounded-2xl overflow-hidden border border-[#EBEBED] bg-[#FAFAFA] shadow-xl text-[13px] sm:text-[15px] font-mono leading-[2] p-8 sm:p-12'>
          
          {/* Base Layer: Exposed Secret */}
          <div className='text-[#1B1B1B]'>
            <span className='text-[#007F6A]'>const</span> agentContext = {'{'}<br />
            &nbsp;&nbsp;task: <span className='text-[#666]'>'Deploy infrastructure'</span>,<br />
            &nbsp;&nbsp;environment: <span className='text-[#666]'>'production'</span>,<br />
            &nbsp;&nbsp;credentials: {'{'}<br />
            &nbsp;&nbsp;&nbsp;&nbsp;aws_access_key: <span className='text-[#E53E3E] font-medium bg-[#E53E3E]/10 px-2 py-1 rounded'>'AKIAIOSFODNN7EXAMPLE'</span><br />
            &nbsp;&nbsp;{'}'}<br />
            {'}'};
          </div>

          {/* Safe Layer: Transformed Secret (Absolute over base) */}
          <div 
            ref={safeLayerRef}
            className='absolute inset-0 bg-[#005E50] text-white p-8 sm:p-12 flex flex-col justify-center'
            style={{ clipPath: 'inset(0% 100% 0% 0%)' }}
          >
            <div>
              <span className='text-[#00C6A5]'>const</span> agentContext = {'{'}<br />
              &nbsp;&nbsp;task: <span className='text-white/80'>'Deploy infrastructure'</span>,<br />
              &nbsp;&nbsp;environment: <span className='text-white/80'>'production'</span>,<br />
              &nbsp;&nbsp;credentials: {'{'}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;aws_access_key: <span className='text-white font-medium bg-[#00C6A5]/20 px-2 py-1 rounded'>'&#123;&#123;secret.aws_prod_key&#125;&#125;'</span><br />
              &nbsp;&nbsp;{'}'}<br />
              {'}'};
            </div>
          </div>

          {/* The Lens glowing edge */}
          <div 
            ref={lensRef}
            className='absolute top-0 bottom-0 w-[3px] bg-[#00C6A5] shadow-[0_0_30px_8px_rgba(0,198,165,0.4)] z-10'
            style={{ left: '0%' }}
          />
        </div>
        
        <p className='text-center text-[#666] mt-10 text-[14px] max-w-[600px] mx-auto leading-relaxed'>
          As you scroll, the AgentSecrets lens intercepts the context window. The exposed credential is removed and replaced with a secure vault reference before the agent even processes it.
        </p>

      </div>
    </section>
  );
}
