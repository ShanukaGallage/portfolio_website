"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TypedLine, OutputLine } from "@/components/Terminal";
import ScrambleText from "@/components/ScrambleText";
import { 
  professionalExperience, 
  openSourcePrograms, 
  leadershipRoles, 
  standaloneAffiliations 
} from "@/data/experience";

export default function ExperienceSection() {
  const [step, setStep] = useState(0);

  return (
    <section className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col pt-32">
      {/* Section Header */}
      <div className="mb-8">
        <TypedLine
          prefix="visitor@portfolio:~$"
          text="history | grep experience"
          typingSpeed={40}
          onComplete={() => setStep(1)}
          showCursor={step === 0}
        />
      </div>

      {step >= 1 && (
        <OutputLine delay={0.1}>
          <div className="mb-12 flex flex-col gap-6">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-text flex items-center gap-2">
              <span className="text-terminal-accent">&gt;</span> <ScrambleText text="Experience & Leadership" />
            </h2>
          </div>

          <div className="flex flex-col gap-16">
            {/* Grid for Professional and Leadership */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
              
              {/* Professional Section */}
              <div className="flex flex-col gap-8 bg-terminal-accent/5 border border-terminal-accent/30 rounded-xl p-6 sm:p-8 relative shadow-[0_0_30px_rgba(0,255,65,0.1)]">
                <h3 className="text-lg md:text-xl font-bold text-terminal-accent border-b border-terminal-accent/40 pb-2">
                  --professional
                </h3>
                <div className="flex flex-col gap-10">
                  {professionalExperience.map((exp) => (
                    <div key={exp.id} className="relative pl-6 sm:pl-8 border-l-2 border-terminal-accent/40 hover:border-terminal-accent transition-colors py-2">
                      <div className="absolute w-3 h-3 bg-terminal-bg border-2 border-terminal-accent rounded-full -left-[7.5px] top-3" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="text-lg font-bold text-terminal-text">
                            {exp.role}
                          </h4>
                          <div className="text-sm md:text-base text-terminal-cyan/90 font-mono mt-1">
                            {exp.company}
                          </div>
                        </div>
                        <span className="shrink-0 font-mono text-xs text-terminal-warning border border-terminal-warning/30 bg-terminal-warning/10 px-2 py-1 rounded">
                          {exp.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs md:text-sm font-mono text-terminal-muted mb-4">
                        <span>{exp.period}</span>
                        <span>|</span>
                        <span>{exp.location}</span>
                      </div>

                      <ul className="list-disc list-outside ml-4 space-y-2 text-terminal-muted/90 leading-relaxed text-xs md:text-sm">
                        {exp.highlights.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leadership Section */}
              <div className="flex flex-col gap-8 sm:pt-4">
                <h3 className="text-lg md:text-xl font-bold text-terminal-accent border-b border-terminal-border/50 pb-2">
                  --leadership
                </h3>
                <div className="flex flex-col gap-10">
                  {leadershipRoles.map((org) => (
                    <div key={org.id} className="flex flex-col">
                      <h4 className="text-lg font-bold text-terminal-text mb-6">
                        {org.organization}
                      </h4>
                      
                      <div className="relative pl-6 ml-2 border-l border-terminal-border/50 flex flex-col gap-6">
                        {org.roles.map((role, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute w-2 h-2 rounded-full bg-terminal-accent/60 -left-[29px] top-2 shadow-[0_0_8px_rgba(0,255,65,0.4)]" />
                            
                            <h5 className="text-base font-bold text-terminal-text/90">
                              {role.title}
                            </h5>
                            <div className="text-xs md:text-sm font-mono text-terminal-muted mt-1 mb-2">
                              {role.period}
                            </div>
                            
                            {role.highlights && role.highlights.length > 0 && (
                              <ul className="list-disc list-outside ml-4 mt-2 space-y-1 text-terminal-muted/80 text-xs md:text-sm">
                                {role.highlights.map((bullet, bIdx) => (
                                  <li key={bIdx}>{bullet}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="h-px bg-terminal-border/30 w-full mt-4" />

                  <div className="flex flex-col gap-4">
                    {standaloneAffiliations.map((aff) => (
                      <div key={aff.id} className="flex items-center gap-3 text-terminal-muted font-mono hover:text-terminal-text transition-colors">
                        <span className="text-terminal-accent">&gt;</span>
                        <span className="text-xs md:text-sm">{aff.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Open Source Section */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg md:text-xl font-bold text-terminal-accent border-b border-terminal-border/50 pb-2">
                --opensource
              </h3>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                {openSourcePrograms.map((prog) => (
                  <div 
                    key={prog.id} 
                    className="flex items-center gap-4 p-3 border border-terminal-border bg-black/30 rounded-lg hover:border-terminal-accent/30 transition-colors shrink-0"
                  >
                    <div className="w-10 h-10 rounded-full border border-terminal-accent/50 flex items-center justify-center font-bold font-mono text-sm text-terminal-accent bg-terminal-accent/5 shrink-0">
                      {prog.acronym}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-terminal-text text-sm md:text-base">{prog.name}</span>
                        <span className="font-mono text-[10px] md:text-xs text-terminal-cyan">{prog.year}</span>
                      </div>
                      <span className="text-xs md:text-sm text-terminal-muted mt-0.5">{prog.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </OutputLine>
      )}
    </section>
  );
}
