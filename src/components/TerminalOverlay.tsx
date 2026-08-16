"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from "lucide-react";
import InteractiveTerminal from "./InteractiveTerminal";

export default function TerminalOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle terminal on Ctrl + `
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      // Close on escape if open
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const handleCustomOpen = () => setIsOpen(true);
    window.addEventListener("open-terminal", handleCustomOpen);
    return () => window.removeEventListener("open-terminal", handleCustomOpen);
  }, []);

  // Lock body scroll when terminal is open (especially if maximized)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Terminal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 sm:bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 hidden sm:block"
            />
            
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`relative bg-terminal-bg flex flex-col overflow-hidden sm:rounded-xl border-t sm:border border-terminal-accent/30 shadow-2xl ${
                isMaximized 
                  ? "w-full h-full sm:rounded-none sm:border-none" 
                  : "w-full h-[85vh] sm:h-[80vh] sm:max-w-4xl"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-terminal-border bg-terminal-surface shrink-0">
                <div className="flex items-center gap-2 text-terminal-text px-2">
                  <TerminalIcon className="w-4 h-4 text-terminal-accent" />
                  <span className="text-sm font-bold tracking-tight">shanuka@portfolio:~</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="p-1.5 text-terminal-muted hover:text-terminal-accent rounded-md hover:bg-terminal-bg transition-colors hidden sm:block"
                    aria-label={isMaximized ? "Restore window" : "Maximize window"}
                  >
                    {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-terminal-muted hover:text-terminal-warning rounded-md hover:bg-terminal-bg transition-colors"
                    aria-label="Close terminal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="flex-1 overflow-hidden">
                <InteractiveTerminal />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
