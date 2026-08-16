"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useRouter } from "next/navigation";
import { TerminalWindow, TypedLine, OutputLine } from "@/components/Terminal";
import ScrambleText from "@/components/ScrambleText";
import { MagneticButton } from "@/components/MagneticButton";
import { profile } from "@/data/profile";

/* ── Particle Canvas ── */
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }[] = [];

    const PARTICLE_COUNT = 60;
    const CONNECTION_DISTANCE = 120;
    const MOUSE_DISTANCE = 150;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Mouse repulsion
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DISTANCE && dist > 0) {
          const force = (MOUSE_DISTANCE - dist) / MOUSE_DISTANCE;
          p.vx += (dx / dist) * force * 0.2;
          p.vy += (dy / dist) * force * 0.2;
        }

        // Dampen velocity
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 65, ${p.alpha})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 255, 65, ${0.06 * (1 - dist / CONNECTION_DISTANCE)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    const cleanup = animate();
    return cleanup;
  }, [animate]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}

/* ── Grain noise SVG data-URI ── */
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`;

/* ── Smoke Wisps ── */
function SmokeBackground({ mouseX, mouseY }: { mouseX: ReturnType<typeof useMotionValue<number>>; mouseY: ReturnType<typeof useMotionValue<number>> }) {
  // 5 wisps with different spring configs → they separate and reform like smoke
  // Wisp 1: fast, close to cursor (core glow)
  const w1x = useSpring(mouseX, { stiffness: 45, damping: 18 });
  const w1y = useSpring(mouseY, { stiffness: 45, damping: 18 });
  // Wisp 2: medium, drifts left-up
  const w2x = useSpring(mouseX, { stiffness: 25, damping: 22 });
  const w2y = useSpring(mouseY, { stiffness: 20, damping: 25 });
  // Wisp 3: slow, drifts right
  const w3x = useSpring(mouseX, { stiffness: 15, damping: 28 });
  const w3y = useSpring(mouseY, { stiffness: 18, damping: 24 });
  // Wisp 4: very slow, drifts down-left (lingering tail)
  const w4x = useSpring(mouseX, { stiffness: 10, damping: 30 });
  const w4y = useSpring(mouseY, { stiffness: 12, damping: 28 });
  // Wisp 5: slowest, ambient haze
  const w5x = useSpring(mouseX, { stiffness: 6, damping: 35 });
  const w5y = useSpring(mouseY, { stiffness: 8, damping: 32 });

  // Compose all 5 wisps into a single layered background
  const smokeBg = useMotionTemplate`
    radial-gradient(ellipse 600px 400px at ${w1x}% ${w1y}%, rgba(34,255,136,0.18) 0%, transparent 60%),
    radial-gradient(ellipse 800px 500px at ${w2x}% ${w2y}%, rgba(20,200,80,0.12) 0%, transparent 55%),
    radial-gradient(ellipse 1000px 600px at ${w3x}% ${w3y}%, rgba(13,77,38,0.2) 0%, transparent 50%),
    radial-gradient(ellipse 900px 700px at ${w4x}% ${w4y}%, rgba(10,60,30,0.15) 0%, transparent 55%),
    radial-gradient(ellipse 1200px 800px at ${w5x}% ${w5y}%, rgba(8,50,25,0.12) 0%, transparent 50%)
  `;

  return (
    <motion.div
      className="absolute inset-0"
      style={{ background: smokeBg, zIndex: 0 }}
      aria-hidden
    />
  );
}

/* ── Hero Section ── */
export default function Hero() {
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);

  // Normalized cursor position (0–100%) for gradient center
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(50);
    mouseY.set(50);
  };

  const handleScrollTo = (id: string) => {
    router.push(`/${id}`);
  };

  const statBadges = [
    { icon: "🐧", label: "Linux" },
    { icon: "🐳", label: "Docker" },
    { icon: "☸️", label: "Kubernetes" },
    { icon: "🏗️", label: "Terraform" },
    { icon: "⚙️", label: "CI/CD" },
    { icon: "📊", label: "Monitoring" },
  ];

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
    >
      {/* ── Background Layers ── */}
      {/* 1. Smoke wisps (base layer) */}
      {mounted && <SmokeBackground mouseX={mouseX} mouseY={mouseY} />}

      {/* 2. Grain/noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: GRAIN_SVG,
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
          opacity: 0.12,
          zIndex: 1,
        }}
        aria-hidden
      />

      {/* 3. Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,65,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,65,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          zIndex: 2,
        }}
      />

      {/* 4. Particle Canvas */}
      {mounted && <ParticleBackground />}

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-24 lg:py-0">

          {/* ── Left Column: Bold Text ── */}
          <div className="space-y-8">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-terminal-accent/30 bg-terminal-accent/5 text-xs text-terminal-accent">
                <span className="w-2 h-2 rounded-full bg-terminal-accent animate-glow-pulse" />
                Available for opportunities
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                <ScrambleText text="Hi, I'm" className="text-terminal-text" />
                <br />
                <ScrambleText text={profile.name.split(" ")[0]} className="text-terminal-accent text-glow" />
                <ScrambleText text={" " + profile.name.split(" ").slice(1).join(" ")} className="text-terminal-text" />
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block ml-2 w-3 md:w-5 h-[0.9em] bg-terminal-accent relative top-[0.1em]"
                />
              </h1>
              <ScrambleText
                text={profile.title}
                as="p"
                className="text-lg md:text-xl text-terminal-muted font-light max-w-lg"
              />
            </motion.div>

            {/* Short bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-sm md:text-base text-terminal-muted leading-relaxed max-w-lg"
            >
              {profile.bio[0]}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticButton>
                <button
                  onClick={() => handleScrollTo("projects")}
                  className="hero-cta hero-cta-primary"
                >
                  <span>$</span> ls projects/
                </button>
              </MagneticButton>
              <MagneticButton>
                <button
                  onClick={() => handleScrollTo("contact")}
                  className="hero-cta hero-cta-secondary"
                >
                  <span>$</span> contact --help
                </button>
              </MagneticButton>
            </motion.div>

            {/* Tech badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              {statBadges.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 + i * 0.08 }}
                  className="hero-stat-badge"
                >
                  <span>{badge.icon}</span>
                  <span className="text-terminal-text">{badge.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right Column: Terminal Window ── */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -5 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative"
          >
            {/* Glow backdrop behind terminal */}
            <div
              className="absolute -inset-4 rounded-2xl opacity-30 blur-2xl"
              style={{
                background: "radial-gradient(ellipse at center, rgba(0,255,65,0.15), transparent 70%)",
              }}
            />

            <TerminalWindow title="shanuka@ops:~ — bash">
              <div className="space-y-3 text-sm">
                {/* Line 1: whoami */}
                <TypedLine
                  prefix="visitor@portfolio:~$"
                  text="whoami"
                  typingSpeed={80}
                  delay={800}
                  onComplete={() => setStep(1)}
                  showCursor={step < 1}
                />

                {/* Output: Name */}
                {step >= 1 && (
                  <OutputLine delay={0.1}>
                    <p className="text-terminal-accent font-bold text-glow">
                      {profile.name}
                    </p>
                    <p className="text-terminal-text text-xs">
                      {profile.title}
                    </p>
                  </OutputLine>
                )}

                {/* Line 2: cat intro.txt */}
                {step >= 1 && (
                  <div className="pt-1">
                    <TypedLine
                      prefix="visitor@portfolio:~$"
                      text="cat intro.txt"
                      typingSpeed={55}
                      delay={500}
                      onComplete={() => setStep(2)}
                      showCursor={step < 2}
                    />
                  </div>
                )}

                {/* Output: Bio */}
                {step >= 2 && (
                  <OutputLine delay={0.1}>
                    <div className="space-y-1.5">
                      {profile.bio.map((line, i) => (
                        <p key={i} className="text-terminal-muted text-xs leading-relaxed">
                          <span className="text-terminal-accent mr-1.5">▸</span>
                          {line}
                        </p>
                      ))}
                    </div>
                  </OutputLine>
                )}

                {/* Line 3: ls sections/ */}
                {step >= 2 && (
                  <div className="pt-1">
                    <TypedLine
                      prefix="visitor@portfolio:~$"
                      text="ls sections/"
                      typingSpeed={55}
                      delay={600}
                      onComplete={() => setStep(3)}
                      showCursor={step < 3}
                    />
                  </div>
                )}

                {/* Output: section listing */}
                {step >= 3 && (
                  <OutputLine delay={0.15}>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      <span className="text-terminal-cyan">about/</span>
                      <span className="text-terminal-cyan">skills/</span>
                      <span className="text-terminal-cyan">projects/</span>
                      <span className="text-terminal-cyan">roadmap/</span>
                      <span className="text-terminal-cyan">contact/</span>
                    </div>
                    <p className="text-terminal-muted text-xs mt-2 italic">
                      # scroll down or use the nav to explore ↓
                    </p>
                  </OutputLine>
                )}
              </div>
            </TerminalWindow>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
