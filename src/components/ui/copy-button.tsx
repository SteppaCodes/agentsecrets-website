"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

const COPY_TIMEOUT_MS = 2000;

const ICON_STYLES = {
  width: 11,
  height: 11,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
} as const;

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_TIMEOUT_MS);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 text-[10px] transition-colors cursor-pointer ${
        className
      }`}
      style={{
        color: copied ? "var(--em)" : "var(--muted)",
        background: "transparent",
        border: "none",
        padding: 0,
      }}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      type="button"
    >
      {copied ? (
        <span>✓ copied</span>
      ) : (
        <>
          <svg {...ICON_STYLES}>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          <span>copy</span>
        </>
      )}
    </button>
  );
}
