'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function RollingNumber({ value, delay = 1.5, triggerRef }: { value: number | string, delay?: number, triggerRef?: React.RefObject<HTMLElement | null> }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useGSAP(() => {
    if (!containerRef.current || hasAnimated) return;
    // Don't animate if value is still the default "0"
    if (String(value) === '0') return;
    
    const digits = gsap.utils.toArray<HTMLElement>('.rolling-digit', containerRef.current);
    
    const animate = () => {
      if (hasAnimated) return;
      setHasAnimated(true);
      digits.forEach((el, index) => {
        let target = parseInt(el.getAttribute('data-target') || '0', 10);
        
        // Slot machine trick: If target is 0, we force it to roll all the way through 1-9 
        // and land on the trailing '0' at the bottom of the column (index 10).
        if (target === 0) target = 10;
        
        gsap.fromTo(el, 
          { y: '0em' }, 
          { 
            y: `-${target * 1.1}em`, 
            duration: 1.6, 
            ease: 'power3.out',
            delay: delay + (index * 0.1)
          }
        );
      });
    };

    if (triggerRef?.current) {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top 85%',
        onEnter: animate,
        once: true,
      });
    } else {
      animate();
    }
  }, { dependencies: [value, hasAnimated], scope: containerRef });

  const chars = String(value).split('');
  
  return (
    <span ref={containerRef} className="inline-flex overflow-hidden h-[1.1em] leading-[1.1em] align-text-bottom" style={{ verticalAlign: '-0.1em' }}>
      {chars.map((char, i) => {
        if (isNaN(parseInt(char))) {
          return <span key={i} className="inline-flex">{char}</span>;
        }
        return (
          <span 
            key={i} 
            className="rolling-digit block" 
            data-target={char}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, idx) => (
              <span key={idx} className="block h-[1.1em] text-center">{n}</span>
            ))}
          </span>
        );
      })}
    </span>
  );
}
