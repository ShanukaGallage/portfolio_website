export interface Profile {
  name: string;
  username: string;
  title: string;
  bio: string[];
  location: string;
  email: string;
  socials: {
    github: string;
    linkedin: string;
    twitter?: string;
    blog?: string;
  };
  stats: {
    label: string;
    value: string;
  }[];
}

export const profile: Profile = {
  name: "Shanuka Gallage",
  username: "shanuka",
  title: "Aspiring DevOps / SRE / Cloud Engineer",
  bio: [
    "Passionate about building reliable, scalable infrastructure and automating everything in between.",
    "Currently deep-diving into Kubernetes orchestration, Infrastructure as Code with Terraform, and designing CI/CD pipelines that actually work.",
    "I believe in the SRE philosophy: measure everything, automate toil, and always have a runbook.",
  ],
  location: "Sri Lanka",
  email: "uni.shanuka@gmail.com",
  socials: {
    github: "https://github.com/ShanukaGallage",
    linkedin: "https://linkedin.com/in/shanuka-gallage",
    twitter: "https://twitter.com/shanuka_dev",
  },
  stats: [
    { label: "UPTIME", value: "22 years" },
    { label: "LOCATION", value: "Sri Lanka 🇱🇰" },
    { label: "STATUS", value: "Learning & Building" },
    { label: "KERNEL", value: "Ubuntu / Arch" },
    { label: "SHELL", value: "zsh + oh-my-zsh" },
    { label: "EDITOR", value: "Neovim / VS Code" },
  ],
};
