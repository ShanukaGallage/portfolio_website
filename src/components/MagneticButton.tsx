"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import React from "react";

interface MagneticButtonProps {
  children: React.ReactElement;
  className?: string;
  padding?: string;
}

export function MagneticButton({ children, className = "", padding = "p-4 -m-4" }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHoverable, setIsHoverable] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // stiffness ~150, damping ~15 gives elastic feel
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  useEffect(() => {
    // Only enable magnetic effect on devices that support hover
    setIsHoverable(window.matchMedia('(hover: hover)').matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHoverable) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Scale offset down by 0.35 so it moves a bit toward the cursor, not 1:1
    x.set((e.clientX - centerX) * 0.35);
    y.set((e.clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    if (!isHoverable) return;
    x.set(0);
    y.set(0);
  };

  if (!isHoverable) {
    return <>{children}</>;
  }

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Added padding creates the invisible hit area so pull starts before cursor touches actual button.
      // Negative margin offsets the layout shift caused by padding.
      className={`relative inline-flex z-10 ${padding} ${className}`}
    >
      <motion.div style={{ x: springX, y: springY }}>
        {children}
      </motion.div>
    </div>
  );
}
