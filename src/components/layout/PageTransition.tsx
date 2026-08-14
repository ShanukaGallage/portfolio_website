"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Skip playing sound on the initial page load
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const playNavSound = () => {
      const audio = new Audio("/keystroke.mp3");
      audio.volume = 0.15; // Reduced volume for a more subtle effect
      audio.play().catch(() => {
        // Silently catch errors if the file is missing or autoplay is blocked
      });
    };

    playNavSound();
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
