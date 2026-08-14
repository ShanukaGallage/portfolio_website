"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { TypedLine, OutputLine } from "@/components/Terminal";
import { projects, Project } from "@/data/projects";
import { ChevronLeft, ChevronRight, X, ExternalLink, GitBranch } from "lucide-react";

export default function Projects() {
  const [step, setStep] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openProject = (project: Project) => {
    // Play interaction sound
    const audio = new Audio("/open.mp3");
    audio.volume = 0.2;
    audio.play().catch(() => {
      // Silently catch errors if file is missing
    });

    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeProject = () => {
    setSelectedProject(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
    }
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
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-text">
              <span className="text-terminal-accent">&gt;</span> Projects
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
                onClick={() => openProject(project)}
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

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden backdrop-blur-sm bg-black/60">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProject}
              className="absolute inset-0"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl bg-terminal-bg border border-terminal-accent/30 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-terminal-border bg-terminal-surface shrink-0">
                <div className="flex flex-col">
                  <h2 className="text-lg md:text-xl font-bold text-terminal-text">
                    {selectedProject.title}
                  </h2>
                  <span className="text-xs text-terminal-accent font-mono">
                    commit: {selectedProject.hash} | date: {selectedProject.date}
                  </span>
                </div>
                <button
                  onClick={closeProject}
                  className="p-2 text-terminal-muted hover:text-terminal-accent transition-colors rounded-lg hover:bg-terminal-surface/80 border border-transparent hover:border-terminal-border"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-4 md:p-6">
                <div className="flex flex-col lg:flex-row gap-6 h-full">
                  {/* Left Side: Carousel & Metadata */}
                  <div className="w-full lg:w-3/5 flex-shrink-0 flex flex-col justify-center space-y-4">
                    <div className="relative group rounded-lg overflow-hidden border border-terminal-border bg-black/50 aspect-video w-full flex items-center justify-center shadow-lg">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={selectedProject.images[currentImageIndex]}
                        alt={`${selectedProject.title} screenshot ${currentImageIndex + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <button
                    onClick={prevImage}
                    className="absolute left-2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-terminal-accent hover:text-black border border-white/10 z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-terminal-accent hover:text-black border border-white/10 z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {selectedProject.images.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentImageIndex ? "bg-terminal-accent w-4" : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded bg-terminal-accent/10 text-terminal-accent border border-terminal-accent/20 font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4 pt-2">
                      {selectedProject.repoUrl && (
                        <a
                          href={selectedProject.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-terminal-cyan hover:text-terminal-accent transition-colors"
                        >
                          <GitBranch className="w-4 h-4" />
                          Repository
                        </a>
                      )}
                      {selectedProject.liveUrl && (
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-terminal-cyan hover:text-terminal-accent transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Content */}
                  <div className="w-full lg:w-2/5 flex flex-col space-y-6 justify-center">
                    <div className="space-y-4">
                      <p className="text-terminal-muted leading-relaxed text-sm md:text-base">
                        {selectedProject.description}
                      </p>
                      
                      {selectedProject.features && selectedProject.features.length > 0 && (
                        <ul className="space-y-2 mt-4 text-sm md:text-base text-terminal-muted">
                          {selectedProject.features.map((feature, idx) => (
                            <li key={idx} className="flex gap-2 items-start">
                              <span className="text-terminal-accent shrink-0 mt-0.5">&gt;</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
