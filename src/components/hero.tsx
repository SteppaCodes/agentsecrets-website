'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  const [stars, setStars] = useState<number | string>('92');
  const [latestTag, setLatestTag] = useState('v1.1.2');

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

  return (
    <section
      className='min-h-screen flex flex-col justify-center bg-white'
      style={{ padding: '0 clamp(32px, 5vw, 100px)' }}
    >
      <div className='w-full max-w-[1200px]'>

        {/* Badge Row - ANIMATES 1ST - Increased GAP to 6 (24px) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className='flex flex-wrap items-center gap-6 mb-12'
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
        </motion.div>

        {/* Headline Container */}
        <h1 className='text-[clamp(30px,3.4vw,44px)] font-bold leading-[1.15] tracking-[-0.02em] text-[#1B1B1B] max-w-[840px]'>
          
          {/* Main Headline - ANIMATES 2ND */}
          <motion.span 
            className='block'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          >
            Zero-Knowledge Secrets for AI Agents:
          </motion.span>
          
          {/* Subtext Headline - ANIMATES 3RD */}
          <motion.span 
            className='block pt-1'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          >
            Secure secret access & management without exposing values at any step.
          </motion.span>

        </h1>

      </div>
    </section>
  );
}
