"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavCommand {
  command: string;
  target: string;
  label: string;
}

const commands: NavCommand[] = [
  { command: "cd ~", target: "/", label: "Home" },
  { command: "whoami", target: "/about", label: "About Me" },
  { command: "ls projects/", target: "/projects", label: "Projects" },
  { command: "cat skills.md", target: "/skills", label: "Skills" },
  { command: "cat roadmap.md", target: "/roadmap", label: "Roadmap" },
  { command: "contact --help", target: "/contact", label: "Contact" },
];

interface CommandNavProps {
  className?: string;
  isSidebar?: boolean;
}

export default function CommandNav({ className = "", isSidebar = false }: CommandNavProps) {
  const pathname = usePathname();

  return (
    <nav className={`flex ${isSidebar ? 'flex-col' : 'flex-wrap'} gap-3 ${className}`} aria-label="Main navigation">
      {commands.map((cmd, i) => {
        const isActive = pathname === cmd.target;
        return (
          <motion.div
            key={cmd.target}
            initial={{ opacity: 0, x: isSidebar ? -20 : 0, y: isSidebar ? 0 : 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.3, delay: isSidebar ? 0.1 * i : 1.8 + i * 0.1 }}
            className="w-full sm:w-auto"
          >
            <Link
              href={cmd.target}
              className={`group flex items-center gap-2 px-3 py-2 rounded-md border 
                        transition-all duration-300 cursor-pointer w-full
                        ${isActive 
                          ? 'border-terminal-accent/50 bg-terminal-accent/10 box-glow' 
                          : 'border-terminal-border bg-terminal-bg/50 hover:border-terminal-accent/50 hover:bg-terminal-accent/5'}`}
              title={cmd.label}
            >
              <span className={`text-sm font-bold ${isActive ? 'text-terminal-accent text-glow' : 'text-terminal-accent'}`}>
                $
              </span>
              <span className={`text-sm transition-colors duration-300 ${
                isActive 
                  ? 'text-terminal-accent text-glow' 
                  : 'text-terminal-text group-hover:text-terminal-accent text-glow-hover'
              }`}>
                {cmd.command}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
