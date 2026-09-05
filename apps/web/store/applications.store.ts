import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppliedOpportunity {
  id: string;
  appliedAt: string;
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'OFFER_MADE' | 'REJECTED';
  matchScore: number;
  coverLetter?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    institution?: string;
    branch?: string;
  };
  opportunity: {
    id: string;
    title: string;
    type: string;
    location?: string;
    organization: {
      name: string;
    };
  };
}

const INITIAL_DEMO_APPLICATIONS: AppliedOpportunity[] = [
  {
    id: 'app_pre_1',
    appliedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: 'SHORTLISTED',
    matchScore: 94,
    coverLetter: 'Extensive hands-on experience building backend microservices with Python, NestJS, and SQL.',
    student: {
      id: 'demo_std_1',
      firstName: 'Vinay',
      lastName: 'Kumar Reddy',
      email: 'student@skillsync.local',
      institution: 'Vishnu Institute of Technology',
      branch: 'Computer Science & Engineering',
    },
    opportunity: {
      id: 'opp_1',
      title: 'Backend Software Engineering Intern',
      type: 'INTERNSHIP',
      location: 'Hyderabad / Remote',
      organization: { name: 'Apex Cloud Systems' },
    },
  },
  {
    id: 'app_pre_2',
    appliedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    status: 'APPLIED',
    matchScore: 89,
    coverLetter: 'Passionate about full-stack web applications using Next.js 15, TypeScript, and modern UI components.',
    student: {
      id: 'demo_std_2',
      firstName: 'Priya',
      lastName: 'Nair',
      email: 'priya.nair@demo.local',
      institution: 'Vishnu Institute of Technology',
      branch: 'Information Technology',
    },
    opportunity: {
      id: 'opp_2',
      title: 'Full Stack Software Engineer',
      type: 'JOB',
      location: 'Bhimavaram / On-Site',
      organization: { name: 'Vishnu Tech Ventures' },
    },
  },
];

interface ApplicationsState {
  applications: AppliedOpportunity[];
  addApplication: (
    opp: AppliedOpportunity['opportunity'],
    student?: Partial<AppliedOpportunity['student']>,
    matchScore?: number,
    coverLetter?: string
  ) => void;
  updateStatus: (appIdOrOppId: string, status: AppliedOpportunity['status']) => void;
  hasApplied: (oppId: string) => boolean;
}

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    (set, get) => ({
      applications: INITIAL_DEMO_APPLICATIONS,

      addApplication: (opp, studentInfo, matchScore = 90, coverLetter = '') => {
        const existing = get().applications.find(
          (a) => a.opportunity.id === opp.id && a.student.email === (studentInfo?.email || 'student@skillsync.local')
        );
        if (existing) return;

        const newApp: AppliedOpportunity = {
          id: `app_${opp.id}_${Date.now()}`,
          appliedAt: new Date().toISOString(),
          status: 'APPLIED',
          matchScore,
          coverLetter,
          student: {
            id: studentInfo?.id || 'demo_std_1',
            firstName: studentInfo?.firstName || 'Vinay',
            lastName: studentInfo?.lastName || 'Kumar Reddy',
            email: studentInfo?.email || 'student@skillsync.local',
            institution: studentInfo?.institution || 'Vishnu Institute of Technology',
            branch: studentInfo?.branch || 'Computer Science & Engineering',
          },
          opportunity: opp,
        };

        set((state) => ({ applications: [newApp, ...state.applications] }));
      },

      updateStatus: (appIdOrOppId, status) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === appIdOrOppId || a.opportunity.id === appIdOrOppId ? { ...a, status } : a
          ),
        }));
      },

      hasApplied: (oppId) => {
        return get().applications.some((a) => a.opportunity.id === oppId);
      },
    }),
    {
      name: 'skillsync-applications',
    }
  )
);
