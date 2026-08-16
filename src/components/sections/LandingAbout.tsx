"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ScrambleText from "@/components/ScrambleText";
import { imageGallery } from "@/data/imageGallery";

export default function LandingAbout() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<{id: number, x: number, y: number, imageIndex: number, rotation: number}[]>([]);
  
  // Track page coordinates for distance calculations to account for scrolling
  const lastSpawnPagePos = useRef({ pageX: 0, pageY: 0 });
  // Track viewport coordinates to know where to spawn during scroll events
  const lastMouse = useRef({ clientX: 0, clientY: 0 });
  
  const trailIdCounter = useRef(0);
  const lastImageIndex = useRef(-1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const trySpawn = (clientX: number, clientY: number) => {
    if (!mounted) return;

    const pageX = clientX + window.scrollX;
    const pageY = clientY + window.scrollY;

    const dist = Math.sqrt(
      Math.pow(pageX - lastSpawnPagePos.current.pageX, 2) +
      Math.pow(pageY - lastSpawnPagePos.current.pageY, 2)
    );

    if (dist > 60) {
      lastSpawnPagePos.current = { pageX, pageY };
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * imageGallery.length);
      } while (nextIndex === lastImageIndex.current && imageGallery.length > 1);
      lastImageIndex.current = nextIndex;

      const id = trailIdCounter.current++;
      const newItem = {
        id,
        x: clientX,
        y: clientY,
        imageIndex: nextIndex,
        rotation: Math.random() * 16 - 8
      };

      setTrail((prev) => {
        const next = [...prev, newItem];
        return next.slice(-6); // Cap at 6
      });

      // Remove after ~800ms
      setTimeout(() => {
        setTrail((prev) => prev.filter((item) => item.id !== id));
      }, 800);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    lastMouse.current = { clientX: e.clientX, clientY: e.clientY };
    trySpawn(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isHovering) {
        trySpawn(lastMouse.current.clientX, lastMouse.current.clientY);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHovering, mounted, trySpawn]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setIsHovering(true);
    lastMouse.current = { clientX: e.clientX, clientY: e.clientY };
    // Optionally spawn one immediately upon entering
    trySpawn(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTrail([]);
  };

  // Parallax for the full-bleed profile3.png break
  const parallaxRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"]
  });
  // Move image vertically for cinematic effect
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["-25%", "25%"]);

  // Parallax for noisy.png
  const { scrollYProgress: noisyScroll } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const noisyY = useTransform(noisyScroll, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["-35%", "35%"]);

  const customBio = [
    "Hello, I'm Shanuka Gallage, an IT undergraduate at the University of Kelaniya, Sri Lanka. While my journey involves software development, my true passion lies in the infrastructure that brings code to life: DevOps, Site Reliability, and the Cloud.",
    "For the past two years, I've been exploring how systems scale and survive in the real world. Instead of just building applications, I focus on deploying and maintaining them—orchestrating continuous integration pipelines, configuring secure Linux environments, and working with distributed NoSQL databases. I love building architectures that don't just function, but are clean, resilient, and thoughtfully automated.",

  ];

  return (
    <section className="relative z-20 w-full bg-transparent pt-8">
      {/* ── 1. About Me Side-by-Side ── */}
      <div ref={ref} className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-24">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 md:mb-20"
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tighter uppercase font-sans">
            <ScrambleText text="ABOUT " /><ScrambleText text="ME" className="font-light font-serif italic text-gray-300" />
          </h2>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-8 relative aspect-[26/15] w-full overflow-hidden"
          >
            <motion.div style={{ y: noisyY }} className="absolute inset-x-0 w-full h-[120%] -top-[25%]">
              <Image
                src="/noisy.png"
                alt="About Shanuka"
                fill
                className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            {/* Subtle grain overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
          </motion.div>

          {/* Right Column: Custom Bio Details */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="lg:col-span-4 space-y-4 lg:pl-6"
          >
            {customBio.map((paragraph, i) => (
              <p
                key={i}
                className="text-gray-100 text-xs md:text-sm leading-relaxed font-sans font-light"
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

        </div>
      </div>

      {/* ── 2. Full-Bleed Cinematic Break ── */}
      <div
        ref={parallaxRef}
        className="relative w-full h-[65vh] min-h-[600px] overflow-hidden mt-8 bg-black"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div style={{ y }} className="absolute inset-0 w-full h-[130%] -top-[15%]">
          <Image
            src="/profile3.png"
            alt="Cinematic Break"
            fill
            className="object-cover object-center opacity-80 mix-blend-screen grayscale blur-[1px] hover:grayscale-0 hover:blur-none hover:opacity-100 transition-all duration-700"
            sizes="100vw"
          />
        </motion.div>
      </div>

      {/* ── Floating Thumbnail Trail ── */}
      <div className="fixed top-0 left-0 z-40 pointer-events-none">
        <AnimatePresence>
          {isHovering && mounted && trail.map((item) => (
            <motion.div
              key={item.id}
              initial={{ 
                opacity: 0, 
                scale: 0, 
                x: item.x - 80,
                y: item.y - 112,
                rotate: item.rotation 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                x: item.x - 80, 
                y: item.y - 112, 
                rotate: item.rotation 
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.7, 
                y: item.y - 112 - 50,
                transition: { duration: 0.3, ease: "easeOut" } 
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className="absolute w-[160px] h-[224px] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/50"
            >
              <Image
                src={imageGallery[item.imageIndex]}
                alt="Trail preview"
                fill
                className="object-cover grayscale"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
