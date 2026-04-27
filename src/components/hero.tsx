'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Hero() {
  const [stars, setStars] = useState<number | string>('92');
  const [latestTag, setLatestTag] = useState('v1.1.2');
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLSpanElement>(null);
  const subtextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/The-17/agentsecrets')
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count) {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => setStars('92'));

    fetch('https://api.github.com/repos/The-17/agentsecrets/tags')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0 && data[0].name) {
          setLatestTag(data[0].name);
        }
      })
      .catch(() => {});
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Set initial invisible states
    gsap.set(badgeRowRef.current, { opacity: 0, y: 30 });
    gsap.set(subtextRef.current, { opacity: 0, y: 40 });

    // Split main headline into words for wave animation
    const headlineSplit = SplitText.create(headlineRef.current!, {
      type: 'words',
    });

    // Set each word invisible initially
    gsap.set(headlineSplit.words, { opacity: 0, yPercent: 120 });

    // Master timeline with ScrollTrigger for replayable animation
    const tl = gsap.timeline({ 
      delay: 0.3,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%', // Ends when bottom of hero is 20% from top of screen
        toggleActions: 'play reverse play reverse',
      }
    });

    // 1. Badge row — smooth fade up
    tl.to(badgeRowRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power2.out',
    })

    // 2. Headline words — staggered wave reveal
    .to(headlineSplit.words, {
      opacity: 1,
      yPercent: 0,
      duration: 1.4,
      stagger: 0.06,
      ease: 'expo.out',
    }, '-=0.7') // overlap with badges

    // 3. Subtext — smooth fade up
    .to(subtextRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: 'power2.out',
    }, '-=0.9'); // overlap with headline

  }, { scope: containerRef });

  return (
    <section
      className='min-h-screen flex flex-col justify-center bg-white'
      style={{ padding: '0 clamp(32px, 5vw, 100px)' }}
    >
      <div className='w-full max-w-[1200px]' ref={containerRef}>

        {/* Badge Row */}
        <div 
          ref={badgeRowRef}
          className='flex flex-wrap items-center gap-6 mb-12'
          style={{ opacity: 0 }}
        >
          <span className='px-5 py-1.5 rounded-full text-[12px] font-light tracking-tight bg-[#F5F5F7]/60 text-[#1B1B1B] font-poppins'>{latestTag}</span>
          <a
            href='https://github.com/The-17/agentsecrets/stargazers'
            target='_blank'
            rel='noopener noreferrer'
            className='px-5 py-1.5 rounded-full text-[12px] font-light tracking-tight bg-[#F5F5F7]/60 text-[#1B1B1B] hover:bg-[#EBEBED] transition-colors font-poppins'
          >
            github: {stars} stars
          </a>
          <span className='px-5 py-1.5 rounded-full text-[12px] font-light tracking-tight bg-[#F5F5F7]/60 text-[#1B1B1B] font-poppins'>secrets stored: 500+</span>
          <span className='hidden sm:inline-flex px-5 py-1.5 rounded-full text-[12px] font-light tracking-tight bg-[#F5F5F7]/60 text-[#1B1B1B] font-poppins'>MIT</span>
        </div>

        {/* Headline Container */}
        <h1 className='text-[clamp(30px,3.4vw,44px)] font-bold leading-[1.15] tracking-[-0.02em] text-[#1B1B1B] max-w-[840px]'>
          
          {/* Main Headline — word-by-word wave animation */}
          <span 
            ref={headlineRef}
            className='block overflow-hidden'
          >
            Zero-Knowledge Secrets for AI Agents:
          </span>
          
          {/* Subtext Headline — smooth fade up */}
          <span 
            ref={subtextRef}
            className='block pt-1'
            style={{ opacity: 0 }}
          >
            Secure secret access &amp; management without exposing values at any step.
          </span>

        </h1>

      </div>
    </section>
  );
}
