"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { TypedLine, OutputLine } from "@/components/Terminal";
import ScrambleText from "@/components/ScrambleText";
import { projects, Project } from "@/data/projects";
import { ExternalLink, GitBranch } from "lucide-react";
import ProjectDetailModal from "@/components/ProjectDetailModal";

export default function Projects() {
  const [step, setStep] = useState(0);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

  const openProject = (index: number) => {
    // Play interaction sound
    const audio = new Audio("/open.mp3");
    audio.volume = 0.2;
    audio.play().catch(() => {
      // Silently catch errors if file is missing
    });

    setSelectedProjectIndex(index);
  };

  const closeProject = () => {
    setSelectedProjectIndex(null);
  };

  const statusColors = {
    merged: "text-terminal-accent border-terminal-accent/30 bg-terminal-accent/10",
    "in-progress": "text-terminal-warning border-terminal-warning/30 bg-terminal-warning/10",
    planned: "text-terminal-muted border-terminal-muted/30 bg-terminal-muted/10",
  };

  return (
    <section id="projects" className="section-container relative">
      <div className="mb-8">
        <TypedLine
          prefix="visitor@portfolio:~$"
          text="ls -la projects/"
          typingSpeed={40}
          onComplete={() => setStep(1)}
          showCursor={step === 0}
        />
      </div>

      {step >= 1 && (
        <OutputLine delay={0.1}>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-text flex items-center gap-2">
              <span className="text-terminal-accent">&gt;</span> <ScrambleText text="Projects" />
            </h2>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.hash}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                layoutId={`project-card-${project.hash}`}
                onClick={() => openProject(i)}
                className="group cursor-pointer rounded-lg border border-terminal-border bg-terminal-surface p-5 flex flex-col h-full hover:border-terminal-accent/50 transition-all duration-300 box-glow-hover hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-terminal-warning font-mono text-xs">
                    {project.hash}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusColors[project.status]}`}>
                    {project.status.toUpperCase()}
                  </span>
                </div>
                
                <h3 className="text-terminal-text font-bold text-lg mb-2 group-hover:text-terminal-accent transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-terminal-muted text-sm mb-4 flex-grow">
                  {project.highlight}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-terminal-border/50">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded bg-terminal-bg text-terminal-muted border border-terminal-border">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-xs px-2 py-0.5 text-terminal-muted">+{project.tags.length - 3}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </OutputLine>
      )}

      {/* Project Detail Modal */}
      <ProjectDetailModal
        projects={projects}
        selectedIndex={selectedProjectIndex}
        onChangeIndex={setSelectedProjectIndex}
        onClose={closeProject}
      />
    </section>
  );
}
