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

import rawProfile from '@/content/profile.json';

export const profile: Profile = rawProfile;
