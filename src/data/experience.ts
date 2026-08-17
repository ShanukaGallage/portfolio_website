import raw from '@/content/experience.json';

export interface ProfessionalExperience {
  id: string;
  role: string;
  company: string;
  type: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface OpenSourceProgram {
  id: string;
  name: string;
  acronym: string;
  year: string;
  role: string;
}

export interface LeadershipRole {
  title: string;
  period: string;
  highlights?: string[];
}

export interface LeadershipOrganization {
  id: string;
  organization: string;
  roles: LeadershipRole[];
}

export interface StandaloneAffiliation {
  id: string;
  title: string;
}

export const professionalExperience: ProfessionalExperience[] = raw.professionalExperience as ProfessionalExperience[];
export const openSourcePrograms: OpenSourceProgram[] = raw.openSourcePrograms as OpenSourceProgram[];
export const leadershipRoles: LeadershipOrganization[] = raw.leadershipRoles as LeadershipOrganization[];
export const standaloneAffiliations: StandaloneAffiliation[] = raw.standaloneAffiliations as StandaloneAffiliation[];
