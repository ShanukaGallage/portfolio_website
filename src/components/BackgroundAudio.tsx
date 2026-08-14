"use client";

import { useState, useRef, useEffect } from "react";

// Define your playlist here. Ensure these files exist in the public/ folder.
const PLAYLIST = [
  { title: "NFS_MW: Do_Ya_Thang", src: "/track1.mp3" },
  { title: "NFS_MW: Fired_Up", src: "/track2.mp3" },
  { title: "NFS_MW: In_A_Hood_Near_You", src: "/track3.mp3" },
];

export default function BackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = PLAYLIST[trackIndex];

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

  const skipTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    // If it was paused and user skips, maybe we want to start playing? 
    // Yes, skipping usually implies intent to listen.
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

      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`px-3 py-2 bg-terminal-surface border transition-all duration-300 font-mono text-xs font-bold box-glow-hover flex items-center gap-2 ${isPlaying
            ? "border-terminal-accent/50 text-terminal-accent"
            : "border-terminal-border text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent"
            }`}
          aria-label="Toggle background music"
          title={isPlaying ? "Pause Music" : "Play Music"}
        >
          <span className={isPlaying ? "animate-pulse" : ""}>{isPlaying ? "[♪]" : "[✕]"}</span>
          <span className="hidden sm:inline">
            {isPlaying ? `${currentTrack.title}` : "NFS_MW SoundTracks: PAUSED"}
          </span>
          <span className="sm:hidden">
            {isPlaying ? "BGM" : "PAUSED"}
          </span>
        </button>

        {/* Skip Button */}
        <button
          onClick={skipTrack}
          className="px-3 py-2 bg-terminal-surface border border-terminal-border text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent transition-all duration-300 font-mono text-xs font-bold box-glow-hover flex items-center justify-center"
          aria-label="Next track"
          title="Next Track"
        >
          [»]
        </button>
      </div>
    </>
  );
}
