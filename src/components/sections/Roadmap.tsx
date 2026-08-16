"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TypedLine, OutputLine } from "@/components/Terminal";
import ScrambleText from "@/components/ScrambleText";
import { roadmapItems } from "@/data/projects";

export default function Roadmap() {
  const [step, setStep] = useState(0);

  const statusIcon = {
    completed: "[x]",
    "in-progress": "[/]",
    planned: "[ ]",
  };

  const statusColor = {
    completed: "text-terminal-accent",
    "in-progress": "text-terminal-warning",
    planned: "text-terminal-muted",
  };

  return (
    <section id="roadmap" className="section-container">
      <div className="mb-8">
        <TypedLine
          prefix="visitor@portfolio:~$"
          text="cat roadmap.md"
          typingSpeed={40}
          onComplete={() => setStep(1)}
          showCursor={step === 0}
        />
      </div>

      {step >= 1 && (
        <OutputLine delay={0.1}>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-text flex items-center gap-2">
              <span className="text-terminal-accent">&gt;</span> <ScrambleText text="Learning Roadmap" />
            </h2>
          </div>

          <div className="relative rounded-lg border border-terminal-border bg-terminal-surface p-4 md:p-6 box-glow">
            <div className="text-terminal-comment text-xs mb-4 pb-3 border-b border-terminal-border">
              # roadmap.md — Learning &amp; Certification Timeline
            </div>

            <div className="space-y-4">
              {roadmapItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="group flex gap-3 p-3 rounded-md hover:bg-terminal-bg/50 transition-colors duration-200"
                >
                  <span className={`font-bold text-sm whitespace-nowrap mt-0.5 ${statusColor[item.status]}`}>
                    {statusIcon[item.status]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-terminal-text font-bold text-sm group-hover:text-terminal-accent transition-colors duration-200">
                        {item.title}
                      </h3>
                      <span className="text-xs text-terminal-muted px-2 py-0.5 rounded bg-terminal-bg border border-terminal-border">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-terminal-muted text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-terminal-border">
              <div className="flex items-center justify-between text-xs text-terminal-muted mb-2">
                <span>Progress</span>
                <span>
                  {roadmapItems.filter((i) => i.status === "completed").length}/{roadmapItems.length} completed
                </span>
              </div>
              <div className="w-full h-2 bg-terminal-bg rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(roadmapItems.filter((i) => i.status === "completed").length / roadmapItems.length) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  className="h-full bg-terminal-accent rounded-full"
                  style={{ boxShadow: "0 0 8px rgba(0,255,65,0.4)" }}
                />
              </div>
            </div>
          </div>
        </OutputLine>
      )}
    </section>
  );
}
