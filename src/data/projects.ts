import raw from '@/content/projects.json';

export interface Project {
  hash: string;
  date: string;
  title: string;
  highlight: string;
  role: string;
  year: string;
  description: string;
  stats: { label: string; value: string }[];
  highlights: string[];
  features?: string[];
  images: string[];
  tags: string[];
  liveUrl: string | null;
  githubRepo: { owner: string; name: string } | null;
  status: "merged" | "in-progress" | "planned";
}

export const projects: Project[] = raw.projects as Project[];

export interface RoadmapItem {
  date: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
}

export const roadmapItems: RoadmapItem[] = raw.roadmapItems as RoadmapItem[];
