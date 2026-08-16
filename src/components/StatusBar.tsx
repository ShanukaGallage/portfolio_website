"use client";

import React from "react";
import { useLiveClock } from "@/hooks/useLiveClock";
import { useUptime } from "@/hooks/useUptime";
import { useGithubStats } from "@/hooks/useGithubStats";
import BackgroundAudio from "@/components/BackgroundAudio";

export default function StatusBar() {
  const clock = useLiveClock();
  const uptime = useUptime("2025-01-19T00:00:00Z");
  const githubStats = useGithubStats();

  return (
    <div className="fixed bottom-0 left-0 w-full h-8 bg-[#050806] border-t border-terminal-accent/20 flex items-center justify-between px-1 sm:px-2 text-[10px] sm:text-xs font-mono text-terminal-muted z-[80] select-none">
      <div className="flex items-center h-full">
        {/* Segment 1: Clock */}
        <div className="flex items-center h-full px-3">
          {clock || "UTC --:--:--"}
        </div>
        
        {/* Segment 2: Uptime (hidden on mobile) */}
        <div className="hidden md:flex items-center h-full px-3 border-l border-terminal-accent/20">
          {uptime || "UPTIME --d --h --m"}
        </div>
        
        {/* Segment 3: Status Indicator */}
        <div className="flex items-center h-full px-3 border-l border-terminal-accent/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-terminal-accent animate-pulse shadow-[0_0_8px_rgba(0,255,65,0.6)]" />
            <span className="text-terminal-accent font-bold tracking-wider">ONLINE</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center h-full">
        {/* Segment: BGM Buttons */}
        <div className="flex items-center h-full border-l border-terminal-accent/20">
          <BackgroundAudio />
        </div>

        {/* Segment 4: GitHub Stats (hidden on mobile, hides on error) */}
        {githubStats !== null && (
          <div className="hidden md:flex items-center h-full px-3 border-l border-terminal-accent/20">
            COMMITS(365d) <span className="text-terminal-accent font-bold ml-2">{githubStats.commits}</span>
          </div>
        )}
      </div>
    </div>
  );
}
