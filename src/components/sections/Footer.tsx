"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/data/profile";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  const year = new Date().getFullYear();

  const columns = [
    "Got an idea that's waiting to come alive? Let's build it together. Whether you're a startup, a team, or an open-source community, I'd love to collaborate and turn your infrastructure vision into reality.",
    "If you're a company or team looking for a DevOps engineer who cares about reliability, automation, and clean architecture, I'm always open to exciting opportunities.",
    "You can reach me through any of my socials below or drop me a message. I'd be happy to connect, collaborate, or just chat about new ideas."
  ];

  const socials = [
    { label: "LINKEDIN", href: profile.socials.linkedin },
    { label: "GITHUB", href: profile.socials.github },
    ...(profile.socials.twitter ? [{ label: "TWITTER", href: profile.socials.twitter }] : []),
  ];

  return (
    <footer ref={ref} className={`relative w-full overflow-hidden ${!isLandingPage ? "bg-terminal-bg border-t border-terminal-border pt-16" : ""}`}>
      
      {/* Background Image - Only on landing page */}
      {isLandingPage && (
        <div className="absolute inset-0 z-0">
          <Image
            src="/footer.png"
            alt="Footer Background"
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-terminal-bg via-transparent to-black/60" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        
        {/* GET IN TOUCH Section - Only on landing page */}
        {isLandingPage && (
          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-16">
            
            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tighter uppercase font-sans mb-16"
            >
              GET IN <span className="font-light font-serif italic text-gray-200">TOUCH</span>
            </motion.h2>

            {/* Three Columns */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-16"
            >
              {columns.map((text, i) => (
                <p key={i} className="text-gray-300 text-sm leading-relaxed font-sans font-light">
                  {text}
                </p>
              ))}
            </motion.div>

            {/* Buttons + Social Links Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            >
              {/* Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-3 border border-white/60 text-white text-xs font-sans tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors duration-300"
                >
                  Let&apos;s Collaborate
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3 bg-white/10 border border-white/20 backdrop-blur-sm text-white text-xs font-sans tracking-[0.2em] uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                >
                  Hire Me
                </Link>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-6 md:gap-8">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-xs font-sans font-bold tracking-[0.15em] uppercase hover:text-terminal-accent transition-colors duration-300"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Giant Name */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 0.15, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          className="w-full overflow-hidden select-none pointer-events-none"
        >
          <h3 className="text-[12vw] md:text-[10vw] text-white leading-[0.85] tracking-tighter uppercase text-center whitespace-nowrap">
            <span className="font-sans font-black">SHANUKA</span>{" "}
            <span className="font-serif font-light italic text-gray-300">GALLAGE</span>
          </h3>
        </motion.div>

        {/* Bottom Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="w-full py-4 text-center border-t border-white/10"
        >
          <p className="text-gray-400 text-xs font-sans">
            Thank you for visiting my portfolio. This website was made with love 💚 by Shanuka Gallage &bull; © {year}
          </p>
        </motion.div>

      </div>
    </footer>
  );
}
