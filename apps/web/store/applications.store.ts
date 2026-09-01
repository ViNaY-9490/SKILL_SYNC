import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppliedOpportunity {
  id: string;
  appliedAt: string;
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED';
  matchScore: number;
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

interface ApplicationsState {
  applications: AppliedOpportunity[];
  addApplication: (opp: AppliedOpportunity['opportunity'], matchScore?: number) => void;
  updateStatus: (oppId: string, status: AppliedOpportunity['status']) => void;
  hasApplied: (oppId: string) => boolean;
}

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    (set, get) => ({
      applications: [
        // Seed with one demo shortlisted entry
        {
          id: 'pre_opp_1',
          appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'SHORTLISTED',
          matchScore: 92,
          opportunity: {
            id: 'opp_1',
            title: 'Backend Software Engineering Intern',
            type: 'INTERNSHIP',
            location: 'Hyderabad / Remote',
            organization: { name: 'Apex Cloud Systems' },
          },
        },
      ],

      addApplication: (opp, matchScore = 88) => {
        const existing = get().applications.find((a) => a.opportunity.id === opp.id);
        if (existing) return;
        const newApp: AppliedOpportunity = {
          id: `app_${opp.id}_${Date.now()}`,
          appliedAt: new Date().toISOString(),
          status: 'APPLIED',
          matchScore,
          opportunity: opp,
        };
        set((state) => ({ applications: [newApp, ...state.applications] }));
      },

      updateStatus: (oppId, status) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.opportunity.id === oppId ? { ...a, status } : a
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
