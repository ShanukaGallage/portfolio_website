"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TerminalWindow, TypedLine, OutputLine } from "@/components/Terminal";
import ScrambleText from "@/components/ScrambleText";
import { profile } from "@/data/profile";

export default function Contact() {
  const [step, setStep] = useState(0);

  return (
    <section id="contact" className="section-container">
      <div className="mb-8">
        <TypedLine
          prefix="visitor@portfolio:~$"
          text="contact --help"
          typingSpeed={40}
          onComplete={() => setStep(1)}
          showCursor={step === 0}
        />
      </div>

      {step >= 1 && (
        <OutputLine delay={0.1}>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-text flex items-center gap-2">
              <span className="text-terminal-accent">&gt;</span> <ScrambleText text="Get In Touch" />
            </h2>
          </div>

          <TerminalWindow title="contact — bash" delay={0}>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <p className="text-terminal-accent font-bold text-sm mb-4">
                  USAGE: contact [OPTIONS]
                </p>

                <div className="space-y-3 mb-6">
                  <p className="text-terminal-text text-sm font-bold">OPTIONS:</p>
                  <div className="space-y-2 pl-2">
                    <ContactOption
                      flag="--email"
                      value={profile.email}
                      href={`mailto:${profile.email}`}
                      delay={0.2}
                    />
                    <ContactOption
                      flag="--github"
                      value={profile.socials.github.replace("https://", "")}
                      href={profile.socials.github}
                      delay={0.3}
                    />
                    <ContactOption
                      flag="--linkedin"
                      value={profile.socials.linkedin.replace("https://", "")}
                      href={profile.socials.linkedin}
                      delay={0.4}
                    />
                    {profile.socials.twitter && (
                      <ContactOption
                        flag="--twitter"
                        value={profile.socials.twitter.replace("https://twitter.com/", "@")}
                        href={profile.socials.twitter}
                        delay={0.5}
                      />
                    )}
                  </div>
                </div>

                <div className="border-t border-terminal-border pt-4">
                  <p className="text-terminal-text text-sm font-bold mb-2">EXAMPLES:</p>
                  <div className="space-y-1 pl-2">
                    <p className="text-terminal-muted text-xs">
                      <span className="text-terminal-accent">$</span>{" "}
                      echo &quot;Hello&quot; | mail {profile.email}
                    </p>
                    <p className="text-terminal-muted text-xs">
                      <span className="text-terminal-accent">$</span>{" "}
                      open {profile.socials.github}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="border-t border-terminal-border pt-4 mt-4"
              >
                <p className="text-terminal-comment text-xs">
                  # I&apos;m always open to discussing DevOps, cloud architecture,
                  <br />
                  # open-source contributions, or potential collaborations.
                  <br />
                  # Feel free to reach out through any of the channels above!
                </p>
              </motion.div>
            </div>
          </TerminalWindow>
        </OutputLine>
      )}
    </section>
  );
}

function ContactOption({
  flag,
  value,
  href,
  delay,
}: {
  flag: string;
  value: string;
  href: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-center gap-3 text-sm"
    >
      <span className="text-terminal-cyan font-bold min-w-[110px]">{flag}</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-terminal-muted hover:text-terminal-accent text-glow-hover transition-colors duration-200"
      >
        {value}
      </a>
    </motion.div>
  );
}
