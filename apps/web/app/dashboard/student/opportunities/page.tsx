'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Clock,
  Filter,
  Bookmark,
  ArrowRight,
  Building2,
  Briefcase,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { OpportunityCard } from '@/components/ui/opportunity-card';
import { Button } from '@/components/ui/button';
import { useApplicationsStore } from '@/store/applications.store';
import { useOpportunitiesStore } from '@/store/opportunities.store';

type OpportunityType = 'INTERNSHIP' | 'JOB' | 'LIVE_PROJECT' | 'WORKSHOP' | 'MENTORSHIP' | 'APPRENTICESHIP';
type WorkMode = 'ONSITE' | 'REMOTE' | 'HYBRID';

interface Skill {
  skill: { id: string; name: string };
  isRequired: boolean;
  requiredLevel: string;
}

interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  industry?: string;
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;
  workMode: WorkMode;
  location?: string;
  duration?: string;
  stipend?: string;
  salary?: string;
  openings: number;
  applicationDeadline?: string;
  organization: Organization;
  skills: Skill[];
  _count: { applications: number };
}

function EmptyState() {
  return (
    <div className="surface-card text-center py-16 p-6">
      <Briefcase className="w-10 h-10 mx-auto mb-3 text-[#A7BDAF]" />
      <h3 className="text-h3 text-[#17231F] mb-1">No Matching Opportunities</h3>
      <p className="text-xs text-[#58645F] max-w-sm mx-auto">
        No active listings match your current filters. Try removing location or competency filters.
      </p>
    </div>
  );
}

const DEMO_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp_1',
    title: 'Backend Software Engineering Intern',
    description: 'Build high-performance REST APIs, Python microservices, and PostgreSQL database pipelines.',
    type: 'INTERNSHIP',
    workMode: 'HYBRID',
    location: 'Hyderabad / Remote',
    stipend: '₹35,000 / mo',
    openings: 5,
    applicationDeadline: '2026-09-25',
    organization: {
      id: 'org_1',
      name: 'Apex Cloud Systems',
      industry: 'Software Engineering & Cloud',
    },
    skills: [
      { skill: { id: 's1', name: 'Python' }, isRequired: true, requiredLevel: 'ADVANCED' },
      { skill: { id: 's2', name: 'DBMS & SQL (Dr. Subba Rao Sir)' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
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
    openings: 3,
    applicationDeadline: '2026-10-10',
    organization: {
      id: 'org_2',
      name: 'Vanguard Innovations',
      industry: 'Enterprise Software',
    },
    skills: [
      { skill: { id: 's4', name: 'React & TypeScript' }, isRequired: true, requiredLevel: 'ADVANCED' },
      { skill: { id: 's5', name: 'Node.js & NestJS' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
      { skill: { id: 's6', name: 'DBMS / SQL' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
    ],
    _count: { applications: 34 },
  },
  {
    id: 'opp_3',
    title: 'Database Architecture & DBMS Research Intern',
    description: 'Work directly on relational query optimization, indexing strategies, and database benchmarks under guidance of Dr. Subba Rao Sir.',
    type: 'INTERNSHIP',
    workMode: 'ONSITE',
    location: 'Vishnu Tech Campus, Bhimavaram',
    stipend: '₹28,000 / mo',
    openings: 4,
    applicationDeadline: '2026-09-30',
    organization: {
      id: 'org_3',
      name: 'Vishnu Tech R&D Labs (DBMS Dept)',
      industry: 'Academic R&D',
    },
    skills: [
      { skill: { id: 's7', name: 'DBMS (Dr. Subba Rao Sir)' }, isRequired: true, requiredLevel: 'ADVANCED' },
      { skill: { id: 's8', name: 'SQL Query Optimization' }, isRequired: true, requiredLevel: 'ADVANCED' },
    ],
    _count: { applications: 12 },
  },
  {
    id: 'opp_4',
    title: 'Cloud Systems & DevOps Graduate Trainee',
    description: 'Deploy microservices with Docker, Kubernetes, and AWS automated CI/CD pipelines.',
    type: 'JOB',
    workMode: 'REMOTE',
    location: 'Bengaluru / Remote',
    salary: '₹10.0 LPA',
    openings: 8,
    applicationDeadline: '2026-10-15',
    organization: {
      id: 'org_4',
      name: 'TechCorp Cloud India',
      industry: 'Cloud Infrastructure',
    },
    skills: [
      { skill: { id: 's9', name: 'Docker & Kubernetes' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
      { skill: { id: 's10', name: 'Linux System Admin' }, isRequired: true, requiredLevel: 'BEGINNER' },
    ],
    _count: { applications: 29 },
  },
];

export default function OpportunitiesPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Interactive Modal & Application States (persisted in Zustand)
  const { addApplication, hasApplied } = useApplicationsStore();
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [showApplyToast, setShowApplyToast] = useState(false);

  let searchTimeout: ReturnType<typeof setTimeout>;
  const handleSearch = (value: string) => {
    setSearch(value);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => setDebouncedSearch(value), 400);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['opportunities', debouncedSearch, typeFilter, modeFilter],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (typeFilter) params.set('type', typeFilter);
        if (modeFilter) params.set('workMode', modeFilter);
        params.set('limit', '20');

        const { data } = await api.get(`/opportunities?${params.toString()}`);
        if (data?.opportunities && data.opportunities.length > 0) return data;
        return { opportunities: DEMO_OPPORTUNITIES, total: DEMO_OPPORTUNITIES.length };
      } catch {
        return { opportunities: DEMO_OPPORTUNITIES, total: DEMO_OPPORTUNITIES.length };
      }
    },
  });

  const handleApplyJob = (opp: Opportunity) => {
    if (!hasApplied(opp.id)) {
      addApplication(
        {
          id: opp.id,
          title: opp.title,
          type: opp.type,
          location: opp.location || opp.workMode,
          organization: { name: opp.organization.name },
        },
        92
      );
      setShowApplyToast(true);
      setTimeout(() => setShowApplyToast(false), 3500);
    }
  };

  const { opportunities: storeOpps } = useOpportunitiesStore();

  const rawOpportunities: Opportunity[] = Array.from(
    new Map([
      ...storeOpps.map((o) => [o.id, o as unknown as Opportunity]),
      ...((data?.opportunities && data.opportunities.length > 0 ? data.opportunities : DEMO_OPPORTUNITIES) as Opportunity[]).map((o) => [o.id, o]),
    ]).values()
  );

  const opportunities = rawOpportunities.filter((opp) => {
    if (typeFilter && opp.type !== typeFilter) return false;
    if (modeFilter && opp.workMode !== modeFilter) return false;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchOrg = opp.organization?.name?.toLowerCase().includes(q);
      const matchSkill = opp.skills?.some((s) => s.skill.name.toLowerCase().includes(q));
      return matchTitle || matchOrg || matchSkill;
    }
    return true;
  });

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {showApplyToast && (
        <div className="fixed top-5 right-5 z-50 bg-[var(--primary-dark)] text-[var(--text-inverse)] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-[var(--primary-green)] animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[var(--primary-green)]" />
          <div>
            <div className="text-xs font-bold">Application Submitted!</div>
            <div className="text-[11px] opacity-90">Tracked in your Application Progression Tracker.</div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card p-6 max-w-xl w-full rounded-xl bg-[var(--surface-paper)] border border-[var(--border-warm)] shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-4 border-b border-[var(--border-warm)]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary-green)]">
                  {selectedOpp.organization?.name}
                </span>
                <h2 className="text-h2 text-[var(--text-primary)] font-bold mt-0.5">{selectedOpp.title}</h2>
                <div className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-3">
                  <span>📍 {selectedOpp.location || selectedOpp.workMode}</span>
                  <span>💰 {selectedOpp.stipend || selectedOpp.salary || 'Competitive'}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedOpp(null)}
                className="p-1 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--surface-subtle)] text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[var(--text-secondary)] leading-relaxed">
              <h3 className="font-bold text-[var(--text-primary)]">Role Description</h3>
              <p>{selectedOpp.description}</p>

              <h3 className="font-bold text-[var(--text-primary)] mt-3">Required Competencies</h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedOpp.skills?.map((s) => (
                  <span key={s.skill.name} className="px-2.5 py-1 rounded bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--border-warm)]">
                    {s.skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-warm)]">
              <Button onClick={() => setSelectedOpp(null)} variant="outline" size="sm">
                Close
              </Button>
              <Button
                onClick={() => {
                  handleApplyJob(selectedOpp);
                  setSelectedOpp(null);
                }}
                disabled={hasApplied(selectedOpp.id)}
                variant="primary"
                size="sm"
              >
                {hasApplied(selectedOpp.id) ? 'Already Applied' : 'Submit Application Now'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-warm)]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-green)] mb-0.5">
            Opportunity Discovery
          </div>
          <h1 className="text-h1 text-[var(--text-primary)]">Industry Placements & Internships</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {data?.total
              ? `${data.total} verified placements matched to your competency profile`
              : 'Discover internships and placements matched to your verified skills'}
          </p>
        </div>

        <Link href="/dashboard/student/copilot">
          <Button variant="outline" size="sm">
            <Zap className="w-4 h-4 text-[var(--accent-saffron)]" />
            AI Precision Match
          </Button>
        </Link>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-[var(--surface-paper)] p-3 rounded-lg border border-[var(--border-warm)] flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Filter opportunities by title, organization, or required skill..."
            className="w-full pl-9 pr-4 py-2 rounded-md text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-dark)]"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-md text-xs font-medium bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none"
          >
            <option value="">All Types</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="JOB">Placement Job</option>
            <option value="LIVE_PROJECT">Live R&D Project</option>
            <option value="WORKSHOP">Workshop</option>
          </select>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="px-3 py-2 rounded-md text-xs font-medium bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none"
          >
            <option value="">All Work Modes</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">On-site</option>
          </select>
        </div>
      </div>

      {/* Opportunity Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="surface-card p-5 space-y-3">
              <div className="skeleton h-5 w-40" />
              <div className="skeleton h-4 w-28" />
              <div className="skeleton h-12 rounded" />
            </div>
          ))}
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              id={opp.id}
              title={opp.title}
              companyName={opp.organization.name}
              location={opp.location || opp.workMode}
              stipend={opp.stipend || opp.salary || 'Competitive'}
              duration={opp.duration || 'Flexible'}
              matchScore={92}
              skillsRequired={opp.skills.map((s) => s.skill.name)}
              matchReasons={[
                'Direct alignment with verified skills',
                'Matched institution referral tier',
              ]}
              applied={hasApplied(opp.id)}
              onApply={() => handleApplyJob(opp)}
              onViewDetails={() => setSelectedOpp(opp)}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
