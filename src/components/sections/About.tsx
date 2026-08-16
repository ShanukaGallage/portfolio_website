"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TerminalWindow, TypedLine, OutputLine } from "@/components/Terminal";
import ScrambleText from "@/components/ScrambleText";
import { profile } from "@/data/profile";

export default function About() {
  const [step, setStep] = useState(0);

  return (
    <section id="about" className="section-container">
      {/* Section Header */}
      <div className="mb-8">
        <TypedLine
          prefix="visitor@portfolio:~$"
          text="cat about.md"
          typingSpeed={40}
          onComplete={() => setStep(1)}
          showCursor={step === 0}
        />
      </div>

      {step >= 1 && (
        <OutputLine delay={0.1}>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-text flex items-center gap-2">
              <span className="text-terminal-accent">&gt;</span> <ScrambleText text="About Me" />
            </h2>
          </div>

          <TerminalWindow title="about.sh — bash" delay={0}>
            <div className="space-y-4">
              {/* Bio paragraphs */}
              <div className="space-y-3">
                {profile.bio.map((paragraph, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.15 }}
                    className="text-terminal-muted text-sm leading-relaxed"
                  >
                    <span className="text-terminal-accent mr-2">▸</span>
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-terminal-border my-4" />

              {/* System info table */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <p className="text-terminal-accent text-xs font-bold mb-3">
                  $ neofetch
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {profile.stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
                      className="flex gap-2 text-sm"
                    >
                      <span className="text-terminal-accent font-bold min-w-[100px]">
                        {stat.label}:
                      </span>
                      <span className="text-terminal-text">{stat.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </TerminalWindow>
        </OutputLine>
      )}
    </section>
  );
}
