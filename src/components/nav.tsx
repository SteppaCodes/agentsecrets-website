'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { label: 'Model', href: '#model' },
  { label: 'Platform', href: '#platform' },
  { label: 'Read docs_', href: '/docs', isPill: true },
  { label: 'FAQ', href: '#faq' },
  { label: 'Github', href: 'https://github.com/The-17/agentsecrets', isExternal: true },
];

export default function Nav() {
  return (
    <nav
      className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white/80 backdrop-blur-sm'
      style={{ padding: '20px clamp(40px, 6vw, 120px)' }}
    >
      {/* Logo */}
      <div className='flex items-center shrink-0'>
        <Link href='/'>
          <Image
            src='/Logo.png'
            alt='Agent Secrets'
            width={160}
            height={36}
            className='h-[30px] w-auto object-contain'
            priority
          />
        </Link>
      </div>

      {/* Centered Nav Links */}
      <div className='absolute left-1/2 -translate-x-1/2 flex items-center gap-8'>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            target={link.isExternal ? '_blank' : undefined}
            rel={link.isExternal ? 'noopener noreferrer' : undefined}
            className={
              link.isPill
                ? 'btn-pill-teal'
                : 'text-[13px] font-medium text-[#1B1B1B]/50 hover:text-[#1B1B1B] transition-colors'
            }
          >
            {link.label}{link.isExternal && ' \u2197'}
          </Link>
        ))}
      </div>

      {/* Right spacer */}
      <div className='w-[160px] shrink-0' />
    </nav>
  );
}
