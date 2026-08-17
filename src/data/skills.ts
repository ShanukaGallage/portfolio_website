import raw from '@/content/skills.json';

export interface SkillItem {
  name: string;
  iconPath: string;
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: SkillItem[];
}

export const skillCategories: SkillCategory[] = raw.skillCategories as SkillCategory[];
