'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ModelSection() {
  return (
    <section
      id='model'
      className='min-h-screen flex flex-col justify-center items-center bg-white'
      style={{ padding: '120px clamp(32px, 5vw, 100px)', paddingLeft: 'clamp(80px, 15vw, 280px)' }}
    >
      <div className='w-full max-w-[1200px] mx-auto'>

        {/* Section Label */}
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className='block text-[13px] font-medium tracking-wide text-[#007F6A] font-poppins mb-8'
        >
          MODEL
        </motion.span>

        {/* Body Text */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className='text-[clamp(16px,1.2vw,19px)] font-normal leading-[1.6] tracking-[-0.01em] text-[#1B1B1B] max-w-[820px]'
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </motion.p>

      </div>
    </section>
  );
}
