"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface TypedLineProps {
  prefix?: string;
  text: string;
  typingSpeed?: number;
  delay?: number;
  onComplete?: () => void;
  showCursor?: boolean;
  className?: string;
  isCommand?: boolean;
  triggerOnView?: boolean;
}

export default function TypedLine({
  prefix = "visitor@portfolio:~$",
  text,
  typingSpeed = 45,
  delay = 0,
  onComplete,
  showCursor = true,
  className = "",
  isCommand = true,
  triggerOnView = false,
}: TypedLineProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  useEffect(() => {
    const shouldStart = triggerOnView ? isInView : true;
    if (!shouldStart) return;

    let interval: NodeJS.Timeout;
    const timeout = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          setIsDone(true);
          onComplete?.();
        }
      }, typingSpeed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, typingSpeed, delay, isInView, triggerOnView]);

  return (
    <div ref={ref} className={`font-mono ${className}`}>
      <span className="flex flex-wrap gap-x-2">
        {prefix && (
          <span className="terminal-prompt whitespace-nowrap text-terminal-accent font-bold">
            {prefix}
          </span>
        )}
        <span className={isCommand ? "text-terminal-text" : "text-terminal-muted"}>
          {displayedText}
          {showCursor && (isTyping || !isDone) && (
            <span className="terminal-cursor" />
          )}
        </span>
      </span>
    </div>
  );
}

/* ── Static output line (no typing animation) ── */

interface OutputLineProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function OutputLine({
  children,
  className = "",
  delay = 0,
}: OutputLineProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className={`text-terminal-muted ${className}`}
    >
      {children}
    </motion.div>
  );
}
