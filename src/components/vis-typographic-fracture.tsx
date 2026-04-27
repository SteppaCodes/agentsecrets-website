'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VisTypographicFracture() {
  const containerRef = useRef<HTMLElement>(null);
  const secretRef = useRef<HTMLSpanElement>(null);
  const redactBlockRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !secretRef.current || !redactBlockRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'center center',
        end: '+=150%',
        pin: true,
        scrub: 0.5,
      }
    });

    // Animate a solid black block slamming down over the text
    tl.fromTo(redactBlockRef.current, 
      { height: '0%', top: '50%' },
      { height: '110%', top: '-5%', duration: 1, ease: 'power4.out' }
    )
    // Secret text changes instantly under the block
    .to(secretRef.current, {
      innerHTML: 'vault.stripe_key',
      color: '#00C6A5',
      duration: 0.1
    })
    // Block lifts off downwards to reveal the safe text
    .to(redactBlockRef.current, {
      height: '0%',
      top: '105%',
      duration: 1,
      ease: 'power4.in'
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className='h-screen flex flex-col justify-center items-center bg-white relative overflow-hidden'>
      
      <h3 className='absolute top-32 text-[20px] font-medium text-[#1B1B1B]/40 font-poppins text-center w-full z-20 tracking-widest uppercase'>
        Concept 2: Typographic Fracture
      </h3>

      <div className='w-full px-6 md:px-12'>
        <div className='text-[clamp(30px,4vw,60px)] font-mono leading-[1.4] text-[#1B1B1B] font-bold tracking-tight max-w-[1200px] mx-auto break-all md:break-normal text-center md:text-left'>
          <span className='text-[#1B1B1B]/30'>const</span> stripe = new Stripe(
          <span className='relative inline-block mx-2 md:mx-4'>
            {/* The text that will change */}
            <span ref={secretRef} className='text-[#E53E3E]'>'sk_live_948f2a7...'</span>
            {/* The solid redaction block */}
            <div ref={redactBlockRef} className='absolute left-[-2%] right-[-2%] bg-[#1B1B1B] z-10' />
          </span>
          );
        </div>
      </div>

    </section>
  );
}
