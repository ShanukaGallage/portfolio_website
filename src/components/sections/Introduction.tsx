"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Introduction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Parallax scroll effect for the background
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  // Move the background down slowly — clamped so it stops before the profile3.png section
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={ref} className="relative w-full h-[75vh] min-h-[500px] flex items-end justify-center overflow-visible">
      {/* Background Image Layer with Parallax */}
      <motion.div
        style={{
          y,
          maskImage: "linear-gradient(to bottom, transparent, black 150px, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 150px, black 85%, transparent 100%)"
        }}
        initial={{ scale: 1.05 }}
        animate={isInView ? { scale: 1 } : { scale: 1.05 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        // Changed top-0 to -top-48 to move the image boundary UP into the Hero section
        className="absolute -top-48 left-0 w-full h-[200%] z-0 origin-center pointer-events-none"
      >
        <Image
          src="/intro-image.png"
          alt="Shanuka Gallage"
          fill
          className="object-cover object-top"
          priority
        />
        {/* Gradient Overlay for text readability, fading to terminal-bg at the very bottom to blend with the next section */}
        <div className="absolute inset-0 bg-gradient-to-t from-terminal-bg via-black/40 to-black/20" />
      </motion.div>

      {/* Content Layer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-10 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">

          {/* Left Column: Huge Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-7"
          >
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[0.9] tracking-tighter font-sans uppercase">
              DEVOPS ENGINEER<br />
              AND CLOUD<br />
              ARCHITECT.
            </h2>
          </motion.div>

          {/* Right Column: Short Summary & Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="lg:col-span-5 space-y-8"
          >
            <p className="text-gray-200 text-sm md:text-base leading-relaxed font-sans font-light">
              I build highly scalable cloud infrastructure and automate complex deployments. For me, DevOps isn&apos;t just about pipelines—it&apos;s about reliability and scale.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/contact"
                className="px-8 py-3 border border-white/60 text-white text-xs font-sans tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors duration-300"
              >
                Let&apos;s Collaborate
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 bg-black/60 border border-transparent backdrop-blur-md text-white text-xs font-sans tracking-[0.2em] uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-300"
              >
                Hire Me
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
