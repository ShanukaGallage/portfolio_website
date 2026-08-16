"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Device detection (standard browser APIs only, no tracking) ── */
function detectDevice(): { prefix: string; text: string }[] {
  // OS detection from userAgent
  const ua = navigator.userAgent;
  let os = "Unknown OS";
  if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (ua.includes("CrOS")) os = "ChromeOS";

  // Architecture hint
  const arch = ua.includes("x86_64") || ua.includes("x64") || ua.includes("Win64")
    ? "x86_64"
    : ua.includes("aarch64") || ua.includes("arm64")
    ? "arm64"
    : ua.includes("arm")
    ? "arm"
    : "x86";

  // CPU cores
  const cores = navigator.hardwareConcurrency || 0;

  // RAM (Chrome/Edge only — returns GB, may be undefined)
  const ram = (navigator as Record<string, unknown>).deviceMemory as number | undefined;

  // GPU via WebGL
  let gpu = "Unknown GPU";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl && gl instanceof WebGLRenderingContext) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        gpu = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || gpu;
      }
    }
  } catch {
    // WebGL not available
  }

  // Locale & timezone
  const locale = navigator.language || "en-US";
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  // Build hardware summary string
  const hwParts = [`${os} ${arch}`];
  if (cores) hwParts.push(`${cores} cores`);
  if (ram) hwParts.push(`${ram}GB RAM`);

  return [
    { prefix: "[OK]", text: " Initializing kernel..." },
    { prefix: "[OK]", text: ` Detected: ${hwParts.join(" | ")}` },
    { prefix: "[OK]", text: ` GPU: ${gpu}` },
    { prefix: "[OK]", text: ` Locale: ${locale} | TZ: ${timezone}` },
    { prefix: "[OK]", text: " Loading modules..." },
    { prefix: "[OK]", text: " Mounting filesystems..." },
    { prefix: "[OK]", text: " Starting services: nginx, docker, sshd..." },
    { prefix: "[OK]", text: " Establishing secure connection..." },
    { prefix: "",     text: "Welcome, shanuka." },
  ];
}

const CHAR_DELAY = 5;        // ms per character
const PREFIX_DELAY = 40;     // ms delay before [OK] appears
const LINE_PAUSE = 20;       // ms pause between lines
const EXIT_DELAY = 100;      // ms after last line before exit starts

export default function BootPreloader({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const [bootLines, setBootLines] = useState<{ prefix: string; text: string }[]>([]);

  // Each line tracks: how many chars typed, whether prefix is shown, whether done
  const [lines, setLines] = useState<{ typed: number; prefixShown: boolean; done: boolean }[]>([]);
  const [activeLine, setActiveLine] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Detect device info and build boot lines
    const detected = detectDevice();
    setBootLines(detected);
    setLines(detected.map(() => ({ typed: 0, prefixShown: false, done: false })));

    // Respect prefers-reduced-motion
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLines(detected.map((l) => ({ typed: l.text.length, prefixShown: true, done: true })));
      setActiveLine(detected.length);
      setAllDone(true);
      const t = setTimeout(() => {
        setVisible(false);
      }, 500);
      return () => clearTimeout(t);
    }

    // Sequential typing engine
    let cancelled = false;

    async function sleep(ms: number) {
      return new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms);
        // Can't truly cancel promises, but we check `cancelled` after each await
        if (cancelled) clearTimeout(t);
      });
    }

    async function run() {
      for (let lineIdx = 0; lineIdx < detected.length; lineIdx++) {
        if (cancelled) return;
        const line = detected[lineIdx];

        setActiveLine(lineIdx);

        // Type each character
        for (let charIdx = 1; charIdx <= line.text.length; charIdx++) {
          if (cancelled) return;
          await sleep(CHAR_DELAY);
          if (cancelled) return;
          setLines((prev) => {
            const next = [...prev];
            next[lineIdx] = { ...next[lineIdx], typed: charIdx };
            return next;
          });
        }

        // Show prefix after a delay (if the line has one)
        if (line.prefix) {
          await sleep(PREFIX_DELAY);
          if (cancelled) return;
          setLines((prev) => {
            const next = [...prev];
            next[lineIdx] = { ...next[lineIdx], prefixShown: true, done: true };
            return next;
          });
        } else {
          setLines((prev) => {
            const next = [...prev];
            next[lineIdx] = { ...next[lineIdx], done: true };
            return next;
          });
        }

        // Pause before next line
        if (lineIdx < detected.length - 1) {
          await sleep(LINE_PAUSE);
        }
      }

      if (cancelled) return;
      setActiveLine(detected.length);
      setAllDone(true);

      // Wait, then trigger exit
      await sleep(EXIT_DELAY);
      if (cancelled) return;
      setVisible(false);
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  // Progress
  const totalChars = bootLines.reduce((sum, l) => sum + l.text.length, 0);
  const typedChars = lines.reduce((sum, s) => sum + s.typed, 0);
  const progress = totalChars > 0 ? Math.round((typedChars / totalChars) * 100) : 0;

  const BAR_WIDTH = 30;
  const filledBlocks = Math.round((progress / 100) * BAR_WIDTH);
  const emptyBlocks = BAR_WIDTH - filledBlocks;

  return (
    <AnimatePresence onExitComplete={() => onCompleteRef.current()}>
      {visible && (
        <motion.div
          key="boot-preloader"
          initial={{ y: "0%" }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.6,
              ease: [0.83, 0, 0.17, 1],
            },
          }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          {/* Terminal output area */}
          <div className="w-full max-w-2xl px-8 font-mono text-sm md:text-base">
            {bootLines.map((line, i) => {
              const state = lines[i];
              // Don't render lines we haven't reached yet or if state isn't ready
              if (!state || i > activeLine) return null;

              const typedText = line.text.slice(0, state.typed);
              const isTyping = i === activeLine && !state.done && !allDone;

              return (
                <div key={i} className="flex items-center mb-1.5">
                  {/* [OK] prefix */}
                  {line.prefix && (
                    <span
                      className="mr-1 font-bold"
                      style={{
                        color: "#00FF41",
                        opacity: state.prefixShown ? 1 : 0,
                        textShadow: state.prefixShown
                          ? "0 0 6px rgba(0,255,65,0.4)"
                          : "none",
                        transition: "opacity 100ms",
                      }}
                    >
                      {line.prefix}
                    </span>
                  )}

                  {/* Typed text */}
                  <span
                    style={{
                      color: i === bootLines.length - 1 ? "#00FF41" : "#E6EDF3",
                      textShadow:
                        i === bootLines.length - 1 && state.done
                          ? "0 0 8px rgba(0,255,65,0.5)"
                          : "none",
                      fontWeight: i === bootLines.length - 1 ? 600 : 400,
                    }}
                  >
                    {typedText}
                  </span>

                  {/* Blinking block cursor */}
                  {isTyping && (
                    <span className="boot-cursor" />
                  )}
                </div>
              );
            })}

            {/* Progress bar */}
            <div className="mt-8 flex items-center gap-3">
              <span style={{ color: "#8B949E" }}>[</span>
              <span
                style={{
                  color: "#00FF41",
                  textShadow: "0 0 4px rgba(0,255,65,0.3)",
                  letterSpacing: "-0.05em",
                }}
              >
                {"█".repeat(filledBlocks)}
              </span>
              <span style={{ color: "#30363D", letterSpacing: "-0.05em" }}>
                {"░".repeat(emptyBlocks)}
              </span>
              <span style={{ color: "#8B949E" }}>]</span>
              <span
                className="ml-2 tabular-nums"
                style={{
                  color: "#00FF41",
                  minWidth: "3.5em",
                  textAlign: "right",
                }}
              >
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
