import React from "react";
import { profile } from "@/data/profile";
import { skillCategories } from "@/data/skills";
import { projects } from "@/data/projects";

export interface TerminalHelpers {
  clear: () => void;
  openUrl: (url: string) => void;
}

export interface Command {
  name: string;
  description: string;
  execute: (args: string[], helpers: TerminalHelpers) => React.ReactNode | string[] | string;
}

export const commands: Record<string, Command> = {
  help: {
    name: "help",
    description: "lists all available commands",
    execute: () => {
      const cmds = Object.values(commands).sort((a, b) => a.name.localeCompare(b.name));
      return (
        <div className="flex flex-col gap-1">
          {cmds.map((cmd) => (
            <div key={cmd.name} className="flex">
              <span className="w-24 text-terminal-cyan font-bold">{cmd.name}</span>
              <span className="text-terminal-muted">- {cmd.description}</span>
            </div>
          ))}
          <div className="mt-2 text-terminal-comment">
            Tip: You can use Tab to autocomplete commands.
          </div>
        </div>
      );
    },
  },
  whoami: {
    name: "whoami",
    description: "short bio",
    execute: () => {
      return (
        <div>
          <span className="text-terminal-accent font-bold">{profile.name}</span>
          <br />
          <span className="text-terminal-text">{profile.title}</span>
        </div>
      );
    },
  },
  about: {
    name: "about",
    description: "longer bio details",
    execute: () => {
      return (
        <div className="flex flex-col gap-2">
          {profile.bio.map((p, i) => (
            <p key={i} className="text-terminal-text leading-relaxed">
              {p}
            </p>
          ))}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {profile.stats.map((s, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-terminal-cyan font-bold w-24">{s.label}:</span>
                <span className="text-terminal-muted">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
  skills: {
    name: "skills",
    description: "lists skill categories",
    execute: () => {
      return (
        <div className="flex flex-col gap-3">
          {skillCategories.map((cat, i) => (
            <div key={i}>
              <div className="text-terminal-accent font-bold mb-1">
                {cat.icon} {cat.name}
              </div>
              <div className="text-terminal-muted pl-4">
                {cat.skills.map(s => s.name).join(", ")}
              </div>
            </div>
          ))}
        </div>
      );
    },
  },
  projects: {
    name: "projects",
    description: "lists project names briefly",
    execute: () => {
      return (
        <div className="flex flex-col gap-2">
          {projects.map((p, i) => (
            <div key={i} className="flex flex-col">
              <div>
                <span className="text-terminal-cyan font-bold">{p.title}</span>
                <span className="text-terminal-muted ml-2">[{p.hash}]</span>
              </div>
              <div className="text-terminal-muted pl-4 text-sm">
                {p.highlight}
              </div>
            </div>
          ))}
          <div className="mt-2 text-terminal-comment">
            Type <span className="text-terminal-accent">open &lt;project-hash&gt;</span> for details.
          </div>
        </div>
      );
    },
  },
  open: {
    name: "open",
    description: "shows more detail on a specific project or URL",
    execute: (args, { openUrl }) => {
      if (args.length === 0) {
        return <span className="text-terminal-warning">Usage: open &lt;project-hash | url&gt;</span>;
      }
      const target = args[0];
      
      // Check if it's a project
      const project = projects.find(
        p => p.hash.toLowerCase() === target.toLowerCase() || p.title.toLowerCase().includes(target.toLowerCase())
      );
      
      if (project) {
        if (project.liveUrl) {
           openUrl(project.liveUrl);
           return `Opening live demo for ${project.title}...`;
        } else if (project.repoUrl) {
           openUrl(project.repoUrl);
           return `Opening repository for ${project.title}...`;
        } else {
           return (
             <div className="flex flex-col gap-2">
               <div className="text-terminal-accent font-bold">{project.title}</div>
               <div className="text-terminal-text">{project.description}</div>
               {project.features && (
                 <ul className="pl-4">
                   {project.features.map((f, i) => (
                     <li key={i} className="text-terminal-muted">- {f}</li>
                   ))}
                 </ul>
               )}
             </div>
           );
        }
      }

      // If it looks like a URL
      if (target.startsWith("http")) {
        openUrl(target);
        return `Opening ${target}...`;
      }

      return <span className="text-terminal-warning">Could not find project or valid URL: {target}</span>;
    },
  },
  contact: {
    name: "contact",
    description: "shows contact info",
    execute: () => {
      return (
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <span className="w-24 text-terminal-cyan font-bold">Email:</span>
            <a href={`mailto:${profile.email}`} className="text-terminal-text hover:underline">{profile.email}</a>
          </div>
          <div className="flex gap-2">
            <span className="w-24 text-terminal-cyan font-bold">LinkedIn:</span>
            <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-terminal-text hover:underline">{profile.socials.linkedin}</a>
          </div>
          <div className="flex gap-2">
            <span className="w-24 text-terminal-cyan font-bold">GitHub:</span>
            <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="text-terminal-text hover:underline">{profile.socials.github}</a>
          </div>
        </div>
      );
    },
  },
  resume: {
    name: "resume",
    description: "triggers the resume PDF download",
    execute: (args, { openUrl }) => {
      openUrl("/Shanuka_Gallage_Resume.pdf");
      return "Downloading resume...";
    },
  },
  clear: {
    name: "clear",
    description: "clears the scrollback",
    execute: (args, { clear }) => {
      clear();
      return "";
    },
  },
  ls: {
    name: "ls",
    description: "lists site sections as if they were files",
    execute: () => {
      return (
        <div className="flex flex-wrap gap-4">
          <span className="text-terminal-text">about.md</span>
          <span className="text-terminal-text">skills.json</span>
          <span className="text-terminal-accent font-bold">projects/</span>
          <span className="text-terminal-text">contact.sh</span>
        </div>
      );
    },
  },
  cat: {
    name: "cat",
    description: "reads content of a file",
    execute: (args) => {
      if (args.length === 0) {
        return <span className="text-terminal-warning">Usage: cat &lt;file&gt;</span>;
      }
      const file = args[0].toLowerCase();
      switch (file) {
        case "about.md":
          return commands.about.execute([], { clear: () => {}, openUrl: () => {} });
        case "skills.json":
          return commands.skills.execute([], { clear: () => {}, openUrl: () => {} });
        case "contact.sh":
          return commands.contact.execute([], { clear: () => {}, openUrl: () => {} });
        case "projects":
        case "projects/":
          return <span className="text-terminal-warning">cat: projects: Is a directory. Try &apos;ls&apos; or &apos;projects&apos; instead.</span>;
        default:
          return <span className="text-terminal-warning">cat: {file}: No such file or directory</span>;
      }
    },
  },
  sudo: {
    name: "sudo",
    description: "execute a command as the superuser",
    execute: (args) => {
      if (args.join(" ") === "make me a sandwich") {
        return <span className="text-terminal-warning">[sudo] password for visitor: nice try. 🥪</span>;
      }
      return <span className="text-terminal-warning">visitor is not in the sudoers file. This incident will be reported.</span>;
    },
  },
};
