"use client";

import { CommandNav } from "@/components/Terminal";

export default function Sidebar() {
  const year = new Date().getFullYear();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-terminal-bg border-r border-terminal-border hidden lg:flex flex-col z-40">
      {/* Header/Logo area */}
      <div className="h-16 flex items-center px-6 border-b border-terminal-border">
        <span className="text-terminal-accent font-bold text-glow">shanuka@ops:~</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-terminal-muted text-xs mb-4 uppercase tracking-wider">Navigation</p>
        <CommandNav isSidebar={true} />
      </div>

      {/* Footer/Stats */}
      <div className="p-6 border-t border-terminal-border space-y-2 text-xs">
        <div className="flex justify-between items-center text-terminal-muted">
          <span>uptime:</span>
          <span>{year - 2004}y</span>
        </div>
        <div className="flex justify-between items-center text-terminal-muted">
          <span>status:</span>
          <span className="flex items-center gap-2 text-terminal-accent">
            online <span className="w-2 h-2 rounded-full bg-terminal-accent animate-glow-pulse" />
          </span>
        </div>
      </div>
    </aside>
  );
}
