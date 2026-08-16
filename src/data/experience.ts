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

export const professionalExperience: ProfessionalExperience[] = [
  {
    id: "prof-1",
    role: "Software Engineer",
    company: "AIESEC in Sri Lanka, National Development Team",
    type: "Volunteer",
    period: "Feb 2026-Present",
    location: "Maharagama",
    highlights: [
      "Selected through island-wide selection pool",
      "Developed dashboards increasing productivity across entities",
      "Team awarded at global ceremony"
    ]
  },
  {
    id: "prof-2",
    role: "Web Developer",
    company: "Niko Web Solution",
    type: "Part Time",
    period: "Jul 2026-Present",
    location: "Matara",
    highlights: [
      "Contributed to 10+ delivered projects across industries",
      "Built a website-reliability monitoring system covering all company-built sites"
    ]
  }
];

export const openSourcePrograms: OpenSourceProgram[] = [
  {
    id: "os-1",
    acronym: "GSSoC",
    name: "GirlScript Summer of Code",
    year: "'26",
    role: "Contributor"
  },
  {
    id: "os-2",
    acronym: "SSoC",
    name: "Social Summer of Code",
    year: "Season 5",
    role: "Contributor"
  },
  {
    id: "os-3",
    acronym: "OSCG",
    name: "Open Source Connect",
    year: "'26",
    role: "Contributor"
  }
];

export const leadershipRoles: LeadershipOrganization[] = [
  {
    id: "lead-org-1",
    organization: "AIESEC in Colombo North",
    roles: [
      {
        title: "Team Manager, B2C Campaigns – Global Outgoing Talent & Teacher",
        period: "Jul 2026-Present",
        highlights: [
          "Leading a team of digital campaign specialists to drive international talent exchange programs"
        ]
      },
      {
        title: "ICX Campaign Designer, Creative Regiment",
        period: "Feb 2026-Present"
      },
      {
        title: "Organizing Committee Vice President - Marketing, SPARKLES'26",
        period: "Jan 2026-Present"
      },
      {
        title: "Team Lead, oGT Digital Campaigns Specialist",
        period: "Jan-Jul 2026"
      },
      {
        title: "Team Member, Outgoing Global Talent & Teacher - Digital Campaigns",
        period: "Aug-Dec 2025"
      }
    ]
  }
];

export const standaloneAffiliations: StandaloneAffiliation[] = [
  {
    id: "aff-1",
    title: "Member, IEEE Student Branch, University of Kelaniya"
  }
];
