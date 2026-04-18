'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Copy, Check } from 'lucide-react';

const INSTALL_METHODS = [
  { id: 'brew', label: 'brew', command: 'brew install The-17/tap/agentsecrets' },
  { id: 'npm', label: 'npm', command: 'npm install -g @the-17/agentsecrets' },
  { id: 'pip', label: 'pip', command: 'pip install agentsecrets-cli' },
  { id: 'go', label: 'go', command: 'go install github.com/The-17/agentsecrets/cmd/agentsecrets@latest' },
];

function getDisplayCommand(fullCommand: string, methodLabel: string): string {
  const prefix = methodLabel + ' ';
  if (fullCommand.startsWith(prefix)) {
    return fullCommand.slice(prefix.length);
  }
  return fullCommand;
}

export default function CommandPill() {
  const [method, setMethod] = useState(INSTALL_METHODS[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isDropdownReady, setIsDropdownReady] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const calmBounce = { type: 'spring', stiffness: 180, damping: 18 };

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 2400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsDropdownReady(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsDropdownReady(false);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(method.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayCmd = getDisplayCommand(method.command, method.label);

  return (
    <div className='fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]'>
      <div ref={menuRef} className='relative flex flex-col items-center'>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15, scale: 0.95, width: '40%' }}
              animate={{ opacity: 1, y: 0, scale: 1, width: '100%' }}
              exit={{ opacity: 0, y: 10, scale: 0.95, width: '40%', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
              transition={calmBounce}
              className='absolute bottom-full mb-5 left-0 bg-[#1B1B1B] rounded-full p-[6px] border border-white/[0.08] shadow-2xl flex flex-row items-center justify-between'
            >
              <AnimatePresence>
                {isDropdownReady && INSTALL_METHODS.map((m, i) => (
                  <motion.button
                    key={m.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ ...calmBounce, delay: i * 0.05 }}
                    onClick={() => {
                      setMethod(m);
                      setIsOpen(false);
                    }}
                    className={'flex flex-1 items-center justify-center h-[40px] rounded-full text-[14px] font-medium transition-colors ' +
                      (method.id === m.id
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:bg-white/5 hover:text-white/70')
                    }
                  >
                    {m.label}
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer Black Pill */}
        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            default: calmBounce, 
            opacity: { delay: 1.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }, 
            y: { delay: 1.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
          }}
          className='bg-[#1B1B1B] rounded-full shadow-lg inline-flex items-center gap-1.5 border border-white/[0.08]'
          style={{ paddingLeft: '16px', paddingRight: isReady ? '8px' : '16px', height: '52px' }}
        >
          
          <motion.button
            layout
            onClick={() => setIsOpen(!isOpen)}
            className='flex items-center justify-center gap-2.5 h-[32px] px-6 shrink-0 hover:bg-white/10 rounded-lg transition-colors'
          >
            <span className='text-[14px] font-medium text-white whitespace-nowrap'>{method.label}</span>
            <ChevronDown
              size={13}
              className={'text-white/40 transition-transform duration-200 ' + (isOpen ? 'rotate-180' : '')}
            />
          </motion.button>
          
          <AnimatePresence>
            {isReady && (
              <>
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...calmBounce, delay: 0.1 }}
                  className='bg-white rounded-full h-[40px] flex items-center justify-center shrink-0'
                  style={{ paddingLeft: '32px', paddingRight: '32px' }}
                >
                  <motion.span 
                    key={method.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className='text-[#1B1B1B] font-mono text-[13px] whitespace-nowrap'
                  >
                    {displayCmd}
                  </motion.span>
                </motion.div>

                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...calmBounce, delay: 0.15 }}
                  onClick={copyToClipboard}
                  className='flex items-center justify-center w-[40px] h-[40px] shrink-0 rounded-full transition-colors text-white hover:bg-white/10'
                  aria-label='Copy install command'
                >
                  {copied ? <Check size={15} className='text-[#007F6A]' /> : <Copy size={15} />}
                </motion.button>
              </>
            )}
          </AnimatePresence>

        </motion.div>

      </div>
    </div>
  );
}
