"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-terminal-bg/80 backdrop-blur-md border-b border-terminal-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="text-terminal-accent font-mono font-bold text-xl tracking-wide">
                <span className="text-terminal-accent">&gt;</span>
                <span className="group-hover:text-terminal-accent transition-colors duration-200">_</span>
              </div>
              <span className="text-terminal-accent font-bold text-sm text-glow hidden sm:inline">
                shanuka@ops:~
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <MagneticButton key={link.href} padding="p-2 -m-2">
                    <Link
                      href={link.href}
                      className="relative px-3 py-2 text-sm font-medium transition-all duration-200 group flex items-center gap-2"
                    >
                      <span className={`font-mono ${isActive ? "text-terminal-accent text-glow" : "text-terminal-muted hover:text-terminal-accent"} transition-colors duration-200`}>
                        {link.label}
                      </span>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-terminal-accent shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
                      )}
                    </Link>
                  </MagneticButton>
                );
              })}
            </div>

            {/* Status + Terminal Toggle + Mobile Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.dispatchEvent(new Event('open-terminal'))}
                className="p-2 rounded-md text-terminal-muted hover:text-terminal-accent focus:outline-none focus:ring-2 focus:ring-terminal-accent transition-colors"
                aria-label="Open Terminal"
                title="Open Terminal (Ctrl + `)"
              >
                <Terminal className="w-5 h-5" />
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-md text-terminal-muted hover:text-terminal-accent focus:outline-none focus:ring-2 focus:ring-terminal-accent transition-colors"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
