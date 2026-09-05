import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OpportunityItem {
  id: string;
  title: string;
  description: string;
  type: 'INTERNSHIP' | 'JOB' | 'LIVE_PROJECT' | 'WORKSHOP' | 'MENTORSHIP' | 'APPRENTICESHIP';
  workMode: 'ONSITE' | 'REMOTE' | 'HYBRID';
  location?: string;
  duration?: string;
  stipend?: string;
  salary?: string;
  openings: number;
  applicationDeadline?: string;
  createdAt: string;
  organization: {
    id: string;
    name: string;
    industry?: string;
    logoUrl?: string;
  };
  skills: Array<{
    skill: { id: string; name: string };
    isRequired: boolean;
    requiredLevel: string;
  }>;
  _count: {
    applications: number;
  };
}

const DEMO_INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp_1',
    title: 'Backend Software Engineering Intern',
    description: 'Build high-performance REST APIs, Python microservices, and PostgreSQL database pipelines.',
    type: 'INTERNSHIP',
    workMode: 'HYBRID',
    location: 'Hyderabad / Remote',
    stipend: '₹35,000 / mo',
    duration: '6 months',
    openings: 5,
    applicationDeadline: '2026-09-25',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    organization: {
      id: 'org_1',
      name: 'Apex Cloud Systems',
      industry: 'Software Engineering & Cloud',
    },
    skills: [
      { skill: { id: 's1', name: 'Python' }, isRequired: true, requiredLevel: 'ADVANCED' },
      { skill: { id: 's2', name: 'SQL & DBMS' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
      { skill: { id: 's3', name: 'REST API' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
    ],
    _count: { applications: 18 },
  },
  {
    id: 'opp_2',
    title: 'Full Stack Software Engineer',
    description: 'Develop responsive enterprise web apps using Next.js 15, TypeScript, Tailwind CSS, and NestJS.',
    type: 'JOB',
    workMode: 'HYBRID',
    location: 'Bhimavaram / On-Site',
    salary: '₹12.5 LPA',
    duration: 'Full Time',
    openings: 3,
    applicationDeadline: '2026-10-10',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    organization: {
      id: 'org_2',
      name: 'Vishnu Tech Ventures',
      industry: 'Enterprise Web Platforms',
    },
    skills: [
      { skill: { id: 's4', name: 'React' }, isRequired: true, requiredLevel: 'ADVANCED' },
      { skill: { id: 's5', name: 'TypeScript' }, isRequired: true, requiredLevel: 'ADVANCED' },
      { skill: { id: 's6', name: 'Node.js' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
    ],
    _count: { applications: 24 },
  },
  {
    id: 'opp_3',
    title: 'AI/ML Engineering Researcher',
    description: 'Fine-tune large language models, build vector embeddings pipelines, and deploy RAG solutions.',
    type: 'LIVE_PROJECT',
    workMode: 'REMOTE',
    location: 'Remote',
    stipend: '₹40,000 / mo',
    duration: '4 months',
    openings: 2,
    applicationDeadline: '2026-09-30',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    organization: {
      id: 'org_3',
      name: 'DeepIntelligence Labs',
      industry: 'Artificial Intelligence & Data Science',
    },
    skills: [
      { skill: { id: 's1', name: 'Python' }, isRequired: true, requiredLevel: 'ADVANCED' },
      { skill: { id: 's7', name: 'PyTorch' }, isRequired: true, requiredLevel: 'ADVANCED' },
      { skill: { id: 's8', name: 'LLMs & GenAI' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
    ],
    _count: { applications: 31 },
  },
];

interface OpportunitiesState {
  opportunities: OpportunityItem[];
  addOpportunity: (oppData: Omit<OpportunityItem, 'id' | 'createdAt' | '_count'>) => OpportunityItem;
  incrementApplicantCount: (oppId: string) => void;
  getOpportunityById: (oppId: string) => OpportunityItem | undefined;
}

export const useOpportunitiesStore = create<OpportunitiesState>()(
  persist(
    (set, get) => ({
      opportunities: DEMO_INITIAL_OPPORTUNITIES,

      addOpportunity: (oppData) => {
        const newOpp: OpportunityItem = {
          ...oppData,
          id: `opp_${Date.now()}`,
          createdAt: new Date().toISOString(),
          _count: { applications: 0 },
        };
        set((state) => ({
          opportunities: [newOpp, ...state.opportunities],
        }));
        return newOpp;
      },

      incrementApplicantCount: (oppId) => {
        set((state) => ({
          opportunities: state.opportunities.map((o) =>
            o.id === oppId ? { ...o, _count: { applications: o._count.applications + 1 } } : o
          ),
        }));
      },

      getOpportunityById: (oppId) => {
        return get().opportunities.find((o) => o.id === oppId);
      },
    }),
    {
      name: 'skillsync-opportunities',
    }
  )
);
