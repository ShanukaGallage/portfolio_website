"use client";

import React, { useState, useRef, useEffect } from "react";
import { commands, TerminalHelpers } from "@/lib/commands";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowRight, ArrowDown } from "lucide-react";

const QUICK_CHIPS = [
  { label: "/projects", command: "projects" },
  { label: "/resume", command: "resume" },
  { label: "/skills", command: "skills" },
  { label: "who are you?", command: "whoami" },
  { label: "/contact", command: "contact" },
];

export default function InteractiveTerminal() {
  const [input, setInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [output, setOutput] = useState<React.ReactNode | string[] | string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter commands based on input
  const availableCommands = Object.values(commands).filter(cmd => 
    cmd.name.toLowerCase().includes(input.toLowerCase().replace(/^\//, '')) ||
    cmd.description.toLowerCase().includes(input.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  // Reset selection when input changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [input]);

  // Keep focus on mount and click
  useEffect(() => {
    inputRef.current?.focus();
  }, [output]);

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (cmdStr: string) => {
    let trimmedCmd = cmdStr.trim();
    // Remove leading slash if user typed it
    if (trimmedCmd.startsWith("/")) {
      trimmedCmd = trimmedCmd.substring(1);
    }
    
    if (!trimmedCmd) return;

    const parts = trimmedCmd.split(" ");
    const baseCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const command = commands[baseCmd];
    
    const helpers: TerminalHelpers = {
      clear: () => {
        setOutput(null);
        setInput("");
      },
      openUrl: (url: string) => {
        const a = document.createElement('a');
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.click();
      }
    };

    if (command) {
      try {
        const result = command.execute(args, helpers);
        if (baseCmd !== "clear") {
          setOutput(result);
          setInput(""); // clear input when showing output
        }
      } catch (err) {
        setOutput(<span className="text-terminal-warning">Error executing command.</span>);
      }
    } else {
      setOutput(
        <span>
          bash: {baseCmd}: command not found.
        </span>
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (output) {
        // If viewing output, Enter can go back or we can just keep standard behavior (do nothing or clear)
        setOutput(null);
        return;
      }
      
      if (input.trim() === "") {
        // Run selected command if input is empty or matches nothing specific
        if (availableCommands.length > 0) {
          executeCommand(availableCommands[selectedIndex].name);
        }
      } else {
        // If they typed something and there's a selected command that perfectly matches, run it
        // Or if it has args, run the raw input
        if (input.includes(" ")) {
          executeCommand(input);
        } else if (availableCommands.length > 0) {
          executeCommand(availableCommands[selectedIndex].name);
        } else {
          executeCommand(input); // will trigger not found
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!output && availableCommands.length > 0) {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : availableCommands.length - 1));
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!output && availableCommands.length > 0) {
        setSelectedIndex(prev => (prev < availableCommands.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (output) {
        setOutput(null);
      } else if (input) {
        setInput("");
      }
    }
  };

  const handleQuickCommand = (cmd: string) => {
    executeCommand(cmd);
    inputRef.current?.focus();
  };

  const renderOutput = (out: React.ReactNode | string[] | string) => {
    if (Array.isArray(out)) {
      return (
        <div className="flex flex-col gap-1">
          {out.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </div>
      );
    }
    return out;
  };

  return (
    <div 
      className="w-full h-full bg-[#0a0f0d] text-terminal-text font-mono flex flex-col relative"
      onClick={handleTerminalClick}
    >
      {/* Top Quick Chips */}
      <div className="flex gap-2 p-3 sm:px-4 sm:pt-4 overflow-x-auto hide-scrollbar shrink-0">
        {QUICK_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickCommand(chip.command)}
            className="px-3 py-1 rounded border border-terminal-accent/30 bg-terminal-accent/5 text-xs text-terminal-accent hover:bg-terminal-accent hover:text-black whitespace-nowrap transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative mx-3 sm:mx-4 mb-2 border border-terminal-accent/20 rounded-md bg-[#050806]">
        
        <AnimatePresence mode="wait">
          {output ? (
            /* Output View */
            <motion.div 
              key="output"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 p-4 overflow-y-auto"
            >
              <div className="text-sm md:text-base leading-relaxed break-words">
                {renderOutput(output)}
              </div>
              <div className="mt-8 text-terminal-muted text-xs flex items-center gap-2">
                <span className="px-1.5 py-0.5 border border-terminal-border rounded bg-terminal-surface">Esc</span>
                to return
              </div>
            </motion.div>
          ) : (
            /* Command List View */
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex flex-col"
            >
              <div className="flex items-center gap-4 px-4 py-2 text-[10px] text-terminal-accent border-b border-terminal-accent/20 tracking-widest shrink-0 opacity-70">
                <span>SLASH COMMANDS</span>
                <span>—</span>
                <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3"/><ArrowDown className="w-3 h-3"/> NAVIGATE</span>
                <span>·</span>
                <span>↵ RUN</span>
              </div>
              
              <div ref={listRef} className="flex-1 overflow-y-auto py-2 hide-scrollbar">
                {availableCommands.length > 0 ? (
                  availableCommands.map((cmd, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div 
                        key={cmd.name}
                        onClick={() => executeCommand(cmd.name)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between px-4 py-2.5 mx-2 rounded cursor-pointer transition-colors ${
                          isSelected ? "bg-terminal-accent/20 text-terminal-accent" : "text-terminal-text hover:bg-terminal-accent/10"
                        }`}
                      >
                        <div className="flex items-center gap-8">
                          <span className={`font-bold w-24 ${isSelected ? "text-terminal-accent" : "text-terminal-cyan"}`}>
                            /{cmd.name}
                          </span>
                          <span className={isSelected ? "text-terminal-text" : "text-terminal-muted"}>
                            {cmd.description}
                          </span>
                        </div>
                        {isSelected && (
                          <ArrowRight className="w-4 h-4 text-terminal-accent" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-6 py-4 text-terminal-muted italic">
                    No commands matching &quot;{input}&quot;
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-3 sm:px-4 sm:pb-4">
        <div className="flex items-center border border-terminal-accent/40 rounded-md bg-[#050806] focus-within:border-terminal-accent transition-colors">
          <div className="pl-4 pr-2 py-3 text-terminal-muted text-sm shrink-0">
            shanuka@portfolio:~$
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (output) setOutput(null); // clear output on typing
            }}
            onKeyDown={handleKeyDown}
            placeholder={output ? "Press Esc to go back..." : "/"}
            className="flex-1 bg-transparent border-none outline-none text-terminal-text font-bold text-sm min-w-0"
            spellCheck="false"
            autoComplete="off"
            aria-label="Terminal command input"
          />
          <button 
            onClick={() => {
              if (output) setOutput(null);
              else if (input) executeCommand(input);
              else if (availableCommands.length > 0) executeCommand(availableCommands[selectedIndex].name);
            }}
            className="p-2 mx-2 rounded hover:bg-terminal-accent/20 text-terminal-accent transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
