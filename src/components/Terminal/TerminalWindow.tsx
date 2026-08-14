"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  maxHeight?: string;
}

export default function TerminalWindow({
  title = "shanuka@ops:~",
  children,
  className = "",
  delay = 0,
  maxHeight,
}: TerminalWindowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`rounded-lg border border-terminal-border bg-terminal-surface overflow-hidden box-glow ${className}`}
    >
      {/* Title Bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-terminal-bg/60 border-b border-terminal-border">
        {/* macOS dots */}
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-terminal-dot-red" />
          <span className="w-3 h-3 rounded-full bg-terminal-dot-yellow" />
          <span className="w-3 h-3 rounded-full bg-terminal-dot-green" />
        </div>
        {/* Title */}
        <span className="flex-1 text-center text-xs text-terminal-muted select-none">
          {title}
        </span>
        {/* Spacer to balance the dots */}
        <div className="w-[52px]" />
      </div>

      {/* Terminal Body */}
      <div
        className="p-4 md:p-6 text-sm md:text-base leading-relaxed overflow-y-auto flex-1"
        style={maxHeight ? { maxHeight } : undefined}
      >
        {children}
      </div>
    </motion.div>
  );
}
