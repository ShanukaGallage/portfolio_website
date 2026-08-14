"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";

export default function LandingAbout() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
  const noisyY = useTransform(noisyScroll, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["-15%", "20%"]);

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
            ABOUT <span className="font-light font-serif italic text-gray-300">ME</span>
          </h2>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-8 relative aspect-[26/12] w-full overflow-hidden"
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

    </section>
  );
}
