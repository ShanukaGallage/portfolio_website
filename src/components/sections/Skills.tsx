"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { TerminalWindow, TypedLine, OutputLine } from "@/components/Terminal";
import { skillCategories } from "@/data/skills";
import { Terminal, Box, Cog, Blocks, Cloud, Activity } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "Linux & OS": <Terminal className="w-5 h-5" />,
  "Containers & Orchestration": <Box className="w-5 h-5" />,
  "CI/CD & Automation": <Cog className="w-5 h-5" />,
  "Infrastructure as Code": <Blocks className="w-5 h-5" />,
  "Cloud Platforms": <Cloud className="w-5 h-5" />,
  "Observability": <Activity className="w-5 h-5" />,
};

export default function Skills() {
  const [step, setStep] = useState(0);

  return (
    <section id="skills" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24">
      {/* Section Header */}
      <div className="mb-8">
        <TypedLine
          prefix="visitor@portfolio:~$"
          text="cat skills.md"
          typingSpeed={40}
          onComplete={() => setStep(1)}
          showCursor={step === 0}
        />
      </div>

      {step >= 1 && (
        <OutputLine delay={0.1}>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-text">
              <span className="text-terminal-accent">&gt;</span> Skills & Technologies
            </h2>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, catIndex) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: catIndex * 0.1 }}
                className="h-full flex"
              >
                <TerminalWindow
                  title={`${category.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}.md`}
                  delay={0}
                  className="w-full h-full flex flex-col"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-terminal-border">
                    <span className="text-terminal-accent flex items-center justify-center">
                      {categoryIcons[category.name] || <span className="text-xl">{category.icon}</span>}
                    </span>
                    <h3 className="text-terminal-accent font-bold text-sm">
                      {category.name}
                    </h3>
                  </div>

                  {/* Skills Icon Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.2 + catIndex * 0.1 + skillIndex * 0.05,
                        }}
                        className="group flex flex-col items-center justify-center p-3 gap-2 
                                   bg-terminal-bg/50 border border-terminal-border rounded-lg 
                                   transition-all duration-300 ease-out
                                   hover:-translate-y-1 hover:scale-105 hover:border-terminal-accent/70 hover:shadow-[0_0_15px_rgba(0,255,65,0.15)]"
                      >
                        <div className="relative w-8 h-8 md:w-10 md:h-10">
                          <Image
                            src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill.iconPath}.svg`}
                            alt={`${skill.name} icon`}
                            fill
                            sizes="(max-width: 768px) 32px, 40px"
                            className="object-contain filter brightness-0 invert opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                          />
                        </div>
                        <span className="text-[10px] sm:text-xs text-center text-terminal-muted group-hover:text-terminal-text transition-colors duration-300 font-medium">
                          {skill.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </TerminalWindow>
              </motion.div>
            ))}
          </div>
        </OutputLine>
      )}
    </section>
  );
}
