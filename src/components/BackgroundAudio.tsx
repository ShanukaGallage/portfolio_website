"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, SkipForward, SkipBack, Play, Pause } from "lucide-react";

// Define your playlist here. Ensure these files exist in the public/ folder.
const PLAYLIST = [
  { title: "NFS_MW: Do_Ya_Thang", src: "/track1.mp3" },
  { title: "NFS_MW: Fired_Up", src: "/track2.mp3" },
  { title: "NFS_MW: In_A_Hood_Near_You", src: "/track3.mp3" },
];

export default function BackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isAttentionPulse, setIsAttentionPulse] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = PLAYLIST[trackIndex];

  // Stop attention pulse after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAttentionPulse(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-play the new track when trackIndex changes (if already playing)
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch((error) => {
        console.warn("Failed to play track:", error);
        setIsPlaying(false);
      });
    }
  }, [trackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.warn("Audio playback failed. Missing file?", error);
            setIsPlaying(false);
          });
      }
    }
  };

  const skipTrack = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const prevTrack = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTrackIndex((prev) => (prev === 0 ? PLAYLIST.length - 1 : prev - 1));
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleEnded = () => {
    // Automatically skip to next track when current ends
    setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onEnded={handleEnded}
        preload="none"
      />

      <div className="flex items-center h-full gap-2 px-2">
        {/* Track Info (Click to toggle play/pause) */}
        <button 
          onClick={() => {
            setIsAttentionPulse(false);
            togglePlay();
          }}
          className="flex items-center gap-1.5 max-w-[100px] sm:max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis border-r border-terminal-accent/20 pr-2 mr-1 hover:opacity-80 transition-opacity focus:outline-none"
          title={isPlaying ? "Pause" : "Play"}
        >
          <span className={`flex items-center gap-1.5 text-xs truncate transition-colors ${
            isPlaying ? "text-terminal-accent" : 
            isAttentionPulse ? "text-terminal-accent animate-pulse" : "text-terminal-muted hover:text-terminal-accent"
          }`}>
            {isPlaying ? <Volume2 className="w-3 h-3 shrink-0" /> : <VolumeX className="w-3 h-3 shrink-0" />}
            <span className="truncate">{currentTrack.title}</span>
          </span>
        </button>

        {/* Media Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={prevTrack}
            className="p-1 text-terminal-muted hover:text-terminal-accent transition-colors focus:outline-none"
            title="Previous Track"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => {
              setIsAttentionPulse(false);
              togglePlay();
            }}
            className={`p-1 transition-colors focus:outline-none ${
              isPlaying ? "text-terminal-accent" : 
              isAttentionPulse ? "text-terminal-accent animate-pulse" : "text-terminal-muted hover:text-terminal-accent"
            }`}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={skipTrack}
            className="p-1 text-terminal-muted hover:text-terminal-accent transition-colors focus:outline-none"
            title="Next Track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}
