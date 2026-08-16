"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+-=[]{}";
const TICK_RATE = 35; // ms per tick
const REVEAL_SPEED = 2; // ticks per character reveal

interface ScrambleTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

export default function ScrambleText({ text, className = "", as: Component = "span" }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const containerRef = useRef<HTMLElement>(null);
  // Trigger when element is somewhat in view
  const isInView = useInView(containerRef as React.RefObject<Element>, { once: true, margin: "-10% 0px" });
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Set initial text to scrambled or original depending on motion preferences
    if (!prefersReducedMotion.current) {
      setDisplayText(
        text.split("").map(char => (char === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)])).join("")
      );
    }
  }, [text]);

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion.current) {
      setDisplayText(text);
      return;
    }

    let currentTick = 0;
    let revealIndex = 0;

    const interval = setInterval(() => {
      currentTick++;

      if (currentTick % REVEAL_SPEED === 0) {
        revealIndex++;
      }

      if (revealIndex >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
        return;
      }

      const scrambled = text
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < revealIndex) return text[index];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplayText(scrambled);
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [isInView, text]);

  return (
    <Component ref={containerRef} className={className} aria-label={text}>
      <span aria-hidden="true">{displayText}</span>
    </Component>
  );
}
