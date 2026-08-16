"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Project } from "@/data/projects";
import { X, ExternalLink, ChevronLeft, ChevronRight, Monitor, Smartphone, GitBranch, Star, GitFork, Clock, ImageIcon } from "lucide-react";

interface ProjectDetailModalProps {
  projects: Project[];
  selectedIndex: number | null;
  onChangeIndex: (index: number) => void;
  onClose: () => void;
}

export default function ProjectDetailModal({ projects, selectedIndex, onChangeIndex, onClose }: ProjectDetailModalProps) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [activeView, setActiveView] = useState<string>("live");
  const [repoData, setRepoData] = useState<any>(null);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState(false);

  const isOpen = selectedIndex !== null;
  const project = isOpen ? projects[selectedIndex] : null;

  // Determine available views dynamically
  const availableViews = project ? [
    ...(project.liveUrl ? ["live"] : []),
    ...(project.githubRepo ? ["readme"] : []),
    ...(project.images ? project.images.map((_, i) => `image-${i}`) : [])
  ] : [];

  // Reset active view when selected project changes
  useEffect(() => {
    if (project) {
      if (project.liveUrl) setActiveView("live");
      else if (project.githubRepo) setActiveView("readme");
      else if (project.images && project.images.length > 0) setActiveView("image-0");
    }
  }, [selectedIndex, project]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChangeIndex((selectedIndex! + 1) % projects.length);
      if (e.key === "ArrowLeft") onChangeIndex((selectedIndex! - 1 + projects.length) % projects.length);
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, selectedIndex, projects.length, onChangeIndex, onClose]);

  // Fetch GitHub repo
  useEffect(() => {
    if (!project || !project.githubRepo) {
      setRepoData(null);
      setRepoError(false);
      return;
    }


      setRepoLoading(true);
      setRepoError(false);
      fetch(`/api/github-repo?owner=${project.githubRepo.owner}&repo=${project.githubRepo.name}`)
        .then(async res => {
          if (!res.ok) {
            setRepoError(true);
            return;
          }
          const data = await res.json();
          setRepoData(data);
        })
        .catch(() => {
          setRepoError(true);
        })
        .finally(() => setRepoLoading(false));
  }, [project]);

  if (!isOpen || !project) return null;

  const handleNext = () => onChangeIndex((selectedIndex! + 1) % projects.length);
  const handlePrev = () => onChangeIndex((selectedIndex! - 1 + projects.length) % projects.length);

  const handleNextView = () => {
    const currentIndex = availableViews.indexOf(activeView);
    if (currentIndex > -1) {
      setActiveView(availableViews[(currentIndex + 1) % availableViews.length]);
    }
  };

  const handlePrevView = () => {
    const currentIndex = availableViews.indexOf(activeView);
    if (currentIndex > -1) {
      setActiveView(availableViews[(currentIndex - 1 + availableViews.length) % availableViews.length]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:px-12 md:py-6 xl:px-24 xl:py-8"
        >
          {/* Outer Chevron Prev Project */}
          <button 
            onClick={handlePrev}
            className="hidden sm:flex absolute left-2 md:left-4 xl:left-8 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/40 text-terminal-muted hover:text-terminal-accent hover:bg-black/80 rounded-full border border-terminal-border/50 transition-all hover:scale-110"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full h-full max-h-[95vh] max-w-7xl bg-terminal-surface border border-terminal-border rounded-xl flex flex-col overflow-hidden shadow-2xl relative"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-border bg-black/40">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-terminal-accent shrink-0">►</span>
                <h3 className="text-terminal-text font-bold uppercase tracking-wider truncate text-sm sm:text-base">
                  {project.title} <span className="text-terminal-muted hidden sm:inline">· {project.highlight}</span>
                </h3>
              </div>

              <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                {/* Device Toggle */}
                {project.liveUrl && (
                  <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-md border border-terminal-border/50">
                    <button
                      onClick={() => setDeviceMode("desktop")}
                      className={`p-1.5 rounded transition-colors ${deviceMode === "desktop" ? "bg-terminal-border text-terminal-accent" : "text-terminal-muted hover:text-terminal-text"}`}
                      title="Desktop View"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeviceMode("mobile")}
                      className={`p-1.5 rounded transition-colors ${deviceMode === "mobile" ? "bg-terminal-border text-terminal-accent" : "text-terminal-muted hover:text-terminal-text"}`}
                      title="Mobile View"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex items-center gap-2">
                  {project.githubRepo && (
                    <a
                      href={`https://github.com/${project.githubRepo.owner}/${project.githubRepo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                        project.liveUrl 
                          ? "text-terminal-text border border-terminal-border bg-black/40 hover:bg-terminal-border/50" 
                          : "text-terminal-bg bg-terminal-accent hover:bg-terminal-accent-dim"
                      }`}
                    >
                      {project.liveUrl ? "GITHUB" : "VIEW ON GITHUB"} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-bold text-terminal-bg bg-terminal-accent hover:bg-terminal-accent-dim px-3 py-1.5 rounded transition-colors"
                    >
                      VISIT <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="text-terminal-muted hover:text-terminal-error transition-colors p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
              
              {/* Left Pane (Live / GitHub) */}
              <div className="flex-1 border-b lg:border-b-0 lg:border-r border-terminal-border bg-[#0a0a0a] relative flex items-center justify-center p-4 overflow-hidden">
                
                {/* Inner Chevron Prev View */}
                {availableViews.length > 1 && (
                  <button 
                    onClick={handlePrevView}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 text-terminal-muted hover:text-terminal-accent hover:bg-black/80 rounded border border-terminal-border/50 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {/* Left Content */}
                {activeView === "live" && project.liveUrl ? (
                  <div className={`transition-all duration-300 ease-in-out h-full border border-terminal-border/50 rounded-md overflow-hidden bg-white ${deviceMode === 'mobile' ? 'w-[375px]' : 'w-full'}`}>
                    <iframe src={project.liveUrl} className="w-full h-full border-0" title="Project Live Preview" />
                  </div>
                ) : activeView === "readme" && project.githubRepo ? (
                  <div data-lenis-prevent="true" className="w-full max-w-3xl h-full flex flex-col p-4 sm:p-8 overflow-y-auto">
                    <div className="border border-terminal-border bg-black/40 rounded-lg p-6 flex flex-col gap-4">
                      {repoLoading ? (
                        <div className="animate-pulse flex flex-col gap-4">
                          <div className="h-6 w-1/3 bg-terminal-border rounded"></div>
                          <div className="h-4 w-2/3 bg-terminal-border rounded"></div>
                        </div>
                      ) : repoError || !repoData ? (
                        <>
                          <div className="flex items-center gap-3 text-terminal-accent">
                            <GitBranch className="w-6 h-6" />
                            <h2 className="text-xl font-bold font-mono">{project.githubRepo?.owner}/{project.githubRepo?.name}</h2>
                          </div>
                          <p className="text-terminal-muted">{project.description}</p>
                          <a
                            href={`https://github.com/${project.githubRepo?.owner}/${project.githubRepo?.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex mt-4 items-center gap-2 text-sm text-terminal-accent hover:underline"
                          >
                            VIEW ON GITHUB <ExternalLink className="w-4 h-4" />
                          </a>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 text-terminal-accent">
                            <GitBranch className="w-6 h-6" />
                            <h2 className="text-xl font-bold font-mono">{project.githubRepo?.owner}/{repoData.name}</h2>
                          </div>
                          <p className="text-terminal-muted">{repoData.description}</p>
                          <div className="flex flex-wrap gap-4 text-xs font-mono text-terminal-text mt-2">
                            {repoData.language && (
                              <div className="flex items-center gap-1.5 border border-terminal-border px-2 py-1 rounded bg-terminal-surface">
                                <span className="w-2 h-2 rounded-full bg-terminal-cyan"></span>
                                {repoData.language}
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 border border-terminal-border px-2 py-1 rounded bg-terminal-surface">
                              <Star className="w-3.5 h-3.5 text-terminal-warning" />
                              {repoData.stars}
                            </div>
                            <div className="flex items-center gap-1.5 border border-terminal-border px-2 py-1 rounded bg-terminal-surface">
                              <GitFork className="w-3.5 h-3.5" />
                              {repoData.forks}
                            </div>
                            <div className="flex items-center gap-1.5 border border-terminal-border px-2 py-1 rounded bg-terminal-surface">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(repoData.updatedAt).toLocaleDateString()}
                            </div>
                          </div>

                          {repoData.readme && (
                            <div className="mt-8 border-t border-terminal-border pt-6">
                              <div className="text-xs text-terminal-muted mb-4 uppercase tracking-widest font-mono">README.md Preview</div>
                              <div className="prose prose-invert prose-sm max-w-none leading-snug prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-pre:my-2 prose-headings:text-terminal-accent prose-a:text-terminal-cyan hover:prose-a:text-terminal-accent prose-code:text-terminal-warning prose-code:bg-black/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-black/50 prose-pre:border prose-pre:border-terminal-border prose-hr:border-terminal-border prose-strong:text-terminal-text prose-li:text-terminal-muted prose-p:text-terminal-muted">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {repoData.readme}
                                </ReactMarkdown>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ) : activeView.startsWith("image-") && project.images ? (
                  <div className="w-full h-full p-4 sm:p-12 flex items-center justify-center relative">
                    <div className="relative w-full h-full">
                      <Image
                        src={project.images[parseInt(activeView.split("-")[1])] || project.images[0]}
                        alt={`Project Preview`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1200px) 100vw, 1200px"
                      />
                    </div>
                  </div>
                ) : null}

                {/* Inner Chevron Next View */}
                {availableViews.length > 1 && (
                  <button 
                    onClick={handleNextView}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 text-terminal-muted hover:text-terminal-accent hover:bg-black/80 rounded border border-terminal-border/50 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Right Pane (Sidebar Info) */}
              <div data-lenis-prevent="true" className="w-full lg:w-[35%] xl:w-[30%] bg-terminal-surface flex flex-col overflow-y-auto">
                <div className="p-6 space-y-8">
                  
                  {/* Header info */}
                  <div>
                    <div className="text-xs text-terminal-muted font-mono tracking-widest mb-2 flex items-center gap-2">
                      <span className="text-terminal-accent">►</span> CASE STUDY
                    </div>
                    <h2 className="text-2xl font-bold text-terminal-text leading-tight mb-2">
                      {project.title}
                    </h2>
                    <p className="text-terminal-accent text-sm mb-4">
                      {project.role} {"//"} {project.year}
                    </p>
                    <p className="text-terminal-muted text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {project.stats?.map((stat, i) => (
                      <div key={i} className="border border-terminal-border bg-black/20 p-3 rounded flex flex-col gap-1">
                        <span className="text-xs text-terminal-muted uppercase">{stat.label}</span>
                        <span className="text-sm font-bold text-terminal-text">{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  {project.highlights && (
                    <div>
                      <h4 className="text-sm font-bold text-terminal-text mb-3 uppercase tracking-wider border-b border-terminal-border pb-2">Highlights</h4>
                      <ul className="space-y-3">
                        {project.highlights.map((highlight, i) => (
                          <li key={i} className="flex gap-2 text-sm text-terminal-muted leading-relaxed">
                            <span className="text-terminal-accent mt-0.5">▶</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="flex items-center justify-center relative px-4 py-2 border-t border-terminal-border bg-black/40 text-xs font-mono text-terminal-muted overflow-x-auto hide-scrollbar min-h-[44px]">
              <div className="flex items-center justify-center gap-2 w-full lg:w-auto lg:pr-[35%] xl:pr-[30%]">
                {project.liveUrl && (
                  <button
                    onClick={() => setActiveView("live")}
                    className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap flex items-center gap-2 ${activeView === "live" ? "bg-terminal-border text-terminal-accent" : "hover:bg-terminal-border/50 hover:text-terminal-text"}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${activeView === "live" ? "bg-terminal-accent animate-pulse" : "bg-terminal-muted"}`}></span>
                    Live Page
                  </button>
                )}
                {project.githubRepo && (
                  <button
                    onClick={() => setActiveView("readme")}
                    className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap flex items-center gap-2 ${activeView === "readme" ? "bg-terminal-border text-terminal-accent" : "hover:bg-terminal-border/50 hover:text-terminal-text"}`}
                  >
                    <GitBranch className="w-3.5 h-3.5" /> Readme.md
                  </button>
                )}
                {project.images?.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveView(`image-${i}`)}
                    className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap flex items-center gap-2 ${activeView === `image-${i}` ? "bg-terminal-border text-terminal-accent" : "hover:bg-terminal-border/50 hover:text-terminal-text"}`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    {i === 0 ? "Diagram" : `Image ${i}`}
                  </button>
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-4 absolute right-4">
                <span>← → SWAP</span>
                <span>ESC CLOSE</span>
              </div>
            </div>

          </motion.div>

          {/* Outer Chevron Next Project */}
          <button 
            onClick={handleNext}
            className="hidden sm:flex absolute right-2 md:right-4 xl:right-8 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/40 text-terminal-muted hover:text-terminal-accent hover:bg-black/80 rounded-full border border-terminal-border/50 transition-all hover:scale-110"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
