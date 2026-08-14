"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CommandNav } from "@/components/Terminal";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-terminal-bg/80 backdrop-blur-sm z-50 lg:hidden"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-terminal-surface border-l border-terminal-border z-50 lg:hidden flex flex-col"
          >
            <div className="h-16 flex items-center justify-between px-6 border-b border-terminal-border">
              <span className="text-terminal-accent font-bold text-sm">Navigation</span>
              <button
                onClick={onClose}
                className="text-terminal-muted hover:text-terminal-text transition-colors p-2"
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div onClick={onClose}>
                <CommandNav isSidebar={true} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
