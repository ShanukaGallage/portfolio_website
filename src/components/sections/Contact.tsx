"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TypedLine, OutputLine } from "@/components/Terminal";
import { MagneticButton } from "@/components/MagneticButton";
import { profile } from "@/data/profile";

export default function Contact() {
  const [step, setStep] = useState(0);
  
  // Contact Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Resume Form State
  const [resumeEmail, setResumeEmail] = useState("");
  const [resumeHoneypot, setResumeHoneypot] = useState("");
  const [resumeStatus, setResumeStatus] = useState<"idle" | "submitting" | "success" | "error" | "cooldown">("idle");
  const [resumeErrorMsg, setResumeErrorMsg] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting" || status === "success") return;

    if (!name.trim()) {
      setStatus("error");
      setErrorMsg("name field required");
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setErrorMsg("valid email field required");
      return;
    }
    if (!message.trim()) {
      setStatus("error");
      setErrorMsg("message field required");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, _honeypot: honeypot }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setErrorMsg(data.error || "failed to send message");
        return;
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg("failed to communicate with server");
    }
  };

  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resumeStatus === "submitting" || resumeStatus === "cooldown") return;

    if (!resumeEmail.trim() || !/^\S+@\S+\.\S+$/.test(resumeEmail)) {
      setResumeStatus("error");
      setResumeErrorMsg("valid email field required");
      return;
    }

    setResumeStatus("submitting");
    setResumeErrorMsg("");

    try {
      const response = await fetch("/api/send-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resumeEmail, _honeypot: resumeHoneypot }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 429) {
          setResumeStatus("error");
          setResumeErrorMsg("429 — rate limit exceeded, try again later");
        } else {
          setResumeStatus("error");
          setResumeErrorMsg(data.error || "500 — failed to send resume");
        }
        
        // Cooldown after error to prevent rapid spamming
        setTimeout(() => setResumeStatus("idle"), 5000);
        return;
      }

      setResumeStatus("success");
      
      // Allow sending again after 5 seconds
      setTimeout(() => {
        setResumeStatus("cooldown");
        setResumeEmail("");
        setTimeout(() => setResumeStatus("idle"), 1000); // 1s cooldown state before idle
      }, 5000);
      
    } catch (err) {
      setResumeStatus("error");
      setResumeErrorMsg("failed to communicate with server");
      setTimeout(() => setResumeStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col pt-32">
      <div className="mb-8">
        <TypedLine
          prefix="visitor@portfolio:~$"
          text="./contact --send"
          typingSpeed={40}
          onComplete={() => setStep(1)}
          showCursor={step === 0}
        />
      </div>

      {step >= 1 && (
        <OutputLine delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start w-full mt-4">
            
            {/* Left Column: Main Contact Form */}
            <div className="flex flex-col w-full">
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-6 w-full font-mono text-sm sm:text-base">
                <div className="absolute overflow-hidden w-0 h-0 opacity-0 -left-[9999px]">
                  <label htmlFor="_honeypot" className="sr-only">Leave this field empty</label>
                  <input 
                    type="text" id="_honeypot" name="_honeypot" 
                    value={honeypot} onChange={(e) => setHoneypot(e.target.value)} 
                    tabIndex={-1} autoComplete="off"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label htmlFor="name" className="text-terminal-accent shrink-0">
                    <span className="sr-only">Name</span>
                    &gt; name:
                  </label>
                  <input
                    type="text" id="name"
                    disabled={status === "submitting" || status === "success"}
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent border-0 border-b border-terminal-border/50 focus:border-terminal-accent outline-none text-terminal-text py-1 transition-colors disabled:opacity-50"
                    spellCheck="false"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label htmlFor="email" className="text-terminal-accent shrink-0">
                    <span className="sr-only">Email</span>
                    &gt; email:
                  </label>
                  <input
                    type="text" id="email"
                    disabled={status === "submitting" || status === "success"}
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent border-0 border-b border-terminal-border/50 focus:border-terminal-accent outline-none text-terminal-text py-1 transition-colors disabled:opacity-50"
                    spellCheck="false"
                  />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <label htmlFor="message" className="text-terminal-accent">
                    <span className="sr-only">Message</span>
                    &gt; message:
                  </label>
                  <textarea
                    id="message" rows={5}
                    disabled={status === "submitting" || status === "success"}
                    value={message} onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-terminal-border/50 focus:border-terminal-accent outline-none text-terminal-text py-2 resize-none transition-colors disabled:opacity-50 leading-relaxed"
                    spellCheck="false"
                  />
                </div>

                <div className="mt-4 flex">
                  <MagneticButton>
                    <button 
                      type="submit" 
                      disabled={status === "submitting" || status === "success"}
                      className="text-terminal-text hover:text-terminal-accent font-bold px-4 py-2 bg-terminal-accent/5 border border-terminal-accent/30 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      [ send message ]
                    </button>
                  </MagneticButton>
                </div>

                <div aria-live="polite" className="mt-6 min-h-[40px] flex flex-col gap-2">
                  {status === "submitting" && (
                    <div className="text-terminal-muted">
                      <span className="text-terminal-accent">&gt;</span> sending <span className="animate-pulse">[###.......]</span>
                    </div>
                  )}
                  {status === "success" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-terminal-accent">
                      &gt; 200 OK — message sent. i&apos;ll get back to you soon.
                    </motion.div>
                  )}
                  {status === "error" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#ff5555]/90 flex flex-col gap-1">
                      {errorMsg.includes("required") || errorMsg.includes("valid") ? (
                        <span>&gt; error: {errorMsg}</span>
                      ) : (
                        <span>
                          &gt; 500 — failed to send. try emailing directly: <a href={`mailto:${profile.email}`} className="underline hover:text-[#ff5555] transition-colors">{profile.email}</a>
                        </span>
                      )}
                    </motion.div>
                  )}
                </div>
              </form>
            </div>

            {/* Right Column: Send Resume & Direct Contact */}
            <div className="flex flex-col gap-16 w-full pt-16 lg:pt-0 lg:pl-16 lg:border-l border-t lg:border-t-0 border-terminal-border/40">
              
              {/* Send Resume Widget */}
              <div className="font-mono text-sm sm:text-base">
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-terminal-muted">visitor@portfolio:~$</span>
                  <span className="text-terminal-text">./send-resume --to=</span>
                </div>
                
                <form onSubmit={handleResumeSubmit} className="flex flex-col gap-6 w-full">
                  <div className="absolute overflow-hidden w-0 h-0 opacity-0 -left-[9999px]">
                    <label htmlFor="_resume_honeypot" className="sr-only">Leave this field empty</label>
                    <input 
                      type="text" id="_resume_honeypot" name="_resume_honeypot" 
                      value={resumeHoneypot} onChange={(e) => setResumeHoneypot(e.target.value)} 
                      tabIndex={-1} autoComplete="off"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label htmlFor="resume_email" className="text-terminal-accent shrink-0">
                      <span className="sr-only">Recipient Email</span>
                      &gt; recipient email:
                    </label>
                    <input
                      type="text" id="resume_email"
                      disabled={resumeStatus === "submitting" || resumeStatus === "cooldown"}
                      value={resumeEmail} onChange={(e) => setResumeEmail(e.target.value)}
                      className="flex-1 bg-transparent border-0 border-b border-terminal-border/50 focus:border-terminal-accent outline-none text-terminal-text py-1 transition-colors disabled:opacity-50"
                      spellCheck="false"
                    />
                  </div>

                  <div className="mt-2 flex">
                    <MagneticButton>
                      <button 
                        type="submit" 
                        disabled={resumeStatus === "submitting" || resumeStatus === "cooldown"}
                        className="text-terminal-text hover:text-terminal-accent font-bold px-4 py-2 bg-terminal-accent/5 border border-terminal-accent/30 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        [ send resume ]
                      </button>
                    </MagneticButton>
                  </div>

                  <div aria-live="polite" className="min-h-[40px] flex flex-col gap-2">
                    {resumeStatus === "submitting" && (
                      <div className="text-terminal-muted">
                        <span className="text-terminal-accent">&gt;</span> transmitting <span className="animate-pulse">[###.......]</span>
                      </div>
                    )}
                    {resumeStatus === "success" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-terminal-accent">
                        &gt; 200 OK — resume sent to {resumeEmail}
                      </motion.div>
                    )}
                    {resumeStatus === "error" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#ff5555]/90">
                        &gt; {resumeErrorMsg.startsWith("429") || resumeErrorMsg.startsWith("500") ? resumeErrorMsg : `error: ${resumeErrorMsg}`}
                      </motion.div>
                    )}
                  </div>
                </form>
              </div>

              {/* Direct Contact Fallback Row */}
              <div className="font-mono text-sm sm:text-base">
                <p className="text-terminal-muted mb-6"># Direct contact fallback paths</p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-x-12 gap-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-terminal-cyan font-bold min-w-[130px] sm:min-w-0 shrink-0">$ cat email.txt</span>
                    <a href={`mailto:${profile.email}`} className="text-terminal-text hover:text-terminal-accent hover:underline transition-colors break-all">
                      {profile.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-terminal-cyan font-bold min-w-[130px] sm:min-w-0 shrink-0">$ open github</span>
                    <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="text-terminal-text hover:text-terminal-accent hover:underline transition-colors break-all">
                      {profile.socials.github.replace("https://", "")}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-terminal-cyan font-bold min-w-[130px] sm:min-w-0 shrink-0">$ open linkedin</span>
                    <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-terminal-text hover:text-terminal-accent hover:underline transition-colors break-all">
                      {profile.socials.linkedin.replace("https://", "")}
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </OutputLine>
      )}
    </section>
  );
}
