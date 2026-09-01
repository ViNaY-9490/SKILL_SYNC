'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Brain,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  Zap,
  ArrowRight,
  Star,
  ChevronRight,
  BarChart3,
  Briefcase,
  Award,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { SkillMap, type SkillNode } from '@/components/ui/skill-map';
import { OpportunityCard } from '@/components/ui/opportunity-card';
import { ApplicationTimeline } from '@/components/ui/application-timeline';
import { Button } from '@/components/ui/button';

// ============================================================
// TYPES
// ============================================================
interface DashboardData {
  profile: {
    firstName: string;
    lastName: string;
    placementReadinessScore: number;
    careerGoal?: string;
    onboardingCompleted: boolean;
  };
  skillsSummary: {
    total: number;
    verified: number;
    topSkills: Array<{ name: string; level: string; verified: boolean }>;
  };
  criticalGaps: Array<{ skill: string; severity: string }>;
  recentApplications: Array<{
    id: string;
    role: string;
    company: string;
    status: string;
    appliedAt: string;
  }>;
  recommendations: Array<{
    id?: string;
    title?: string;
    role?: string;
    company?: string;
    companyName?: string;
    location?: string;
    stipend?: string;
    duration?: string;
    type?: string;
    score: number;
    reasons: Array<{ type: string; description: string }>;
  }>;
}

// ============================================================
// LOADING SKELETON
// ============================================================
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-64 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="surface-card p-5 space-y-3">
            <div className="skeleton h-8 w-8 rounded-lg" />
            <div className="skeleton h-6 w-20" />
            <div className="skeleton h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
const DEMO_STUDENT_DASHBOARD: DashboardData = {
  profile: {
    firstName: 'Vinay',
    lastName: 'Kumar Reddy',
    placementReadinessScore: 84,
    careerGoal: 'Full-Stack Software Engineer',
    onboardingCompleted: true,
  },
  skillsSummary: {
    total: 12,
    verified: 8,
    topSkills: [
      { name: 'Python & Data Structures', level: 'ADVANCED', verified: true },
      { name: 'SQL & Database Design', level: 'INTERMEDIATE', verified: true },
      { name: 'REST API Design & NestJS', level: 'INTERMEDIATE', verified: true },
      { name: 'Docker & Containerization', level: 'BEGINNER', verified: false },
      { name: 'System Architecture', level: 'INTERMEDIATE', verified: true },
    ],
  },
  criticalGaps: [
    { skill: 'Docker & Containerization', severity: 'HIGH' },
    { skill: 'AWS Cloud Services', severity: 'MEDIUM' },
  ],
  recentApplications: [
    { id: 'app_1', role: 'Backend Engineering Intern', company: 'Apex Cloud Systems', status: 'SHORTLISTED', appliedAt: '2 days ago' },
    { id: 'app_2', role: 'Full Stack Software Engineer', company: 'Vanguard Innovations', status: 'UNDER_REVIEW', appliedAt: '5 days ago' },
  ],
  recommendations: [
    {
      id: 'rec_1',
      title: 'Backend Software Engineering Intern',
      companyName: 'Apex Cloud Systems',
      location: 'Hyderabad / Remote',
      stipend: '₹35,000 / mo',
      type: 'INTERNSHIP',
      score: 92,
      reasons: [
        { type: 'SKILL_MATCH', description: 'Matched 4/5 core requirements: Python, SQL, REST APIs, Git' },
        { type: 'INSTITUTION_VERIFIED', description: 'Verified by Vishnu Institute Placement Cell' },
      ],
    },
    {
      id: 'rec_2',
      title: 'Full Stack Software Engineer',
      companyName: 'Vanguard Innovations',
      location: 'Bhimavaram / Hybrid',
      stipend: '₹45,000 / mo',
      type: 'FULL_TIME',
      score: 87,
      reasons: [
        { type: 'SKILL_MATCH', description: 'Matched React, TypeScript, and Database Architecture' },
      ],
    },
  ],
};

// ============================================================
// MAIN STUDENT DASHBOARD
// ============================================================
export default function StudentDashboard() {
  const { user } = useAuthStore();

  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['student-dashboard'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/students/dashboard');
        if (data && data.profile) return data;
        return DEMO_STUDENT_DASHBOARD;
      } catch {
        return DEMO_STUDENT_DASHBOARD;
      }
    },
    enabled: !!user,
  });

  if (isLoading) return <DashboardSkeleton />;

  const data = dashboardData || DEMO_STUDENT_DASHBOARD;

  const { profile, skillsSummary, criticalGaps, recentApplications, recommendations } = data;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const readinessScore = profile.placementReadinessScore || 84;
  const targetRole = profile.careerGoal || 'Full-Stack Software Engineer';

  // Map API topSkills into SkillNode format for SkillMap
  const mappedSkills: SkillNode[] = (skillsSummary.topSkills || []).map((s, idx) => ({
    id: `skill-${idx}`,
    name: s.name,
    category: s.verified ? 'Verified Core Competency' : 'Self-Declared Skill',
    status: s.verified ? 'STRONG' : s.level === 'ADVANCED' || s.level === 'INTERMEDIATE' ? 'DEVELOPING' : 'NEEDS_ATTENTION',
    evidenceCount: s.verified ? 2 : 0,
    relevance: `Direct requirement for ${targetRole} positions.`,
    recommendedAction: s.verified ? 'Evidence verified by faculty.' : 'Upload project report or complete assessment.',
    relatedOpportunitiesCount: 3,
  }));

  return (
    <div className="space-y-6">
      {/* =========== TOP HERO BANNER: WHAT IS IMPORTANT RIGHT NOW? =========== */}
      <div className="bg-[var(--surface-paper)] border border-[var(--border-warm)] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-green)] mb-1">
              Institutional Student Overview
            </div>
            <h1 className="text-h1 text-[var(--text-primary)]">
              {greeting}, {profile.firstName || 'Vinay'}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[var(--accent-saffron)]" />
              Target Role: <strong className="text-[var(--text-primary)] font-semibold">{targetRole}</strong>
            </p>
          </div>

          {/* Core Metrics Pill */}
          <div className="flex items-center gap-4 bg-[var(--surface-bg)] p-4 rounded-lg border border-[var(--border-subtle)]">
            <div className="text-right border-r border-[var(--border-warm)] pr-4">
              <div className="text-xs text-[var(--text-secondary)]">Placement Readiness</div>
              <div className="text-2xl font-bold text-[var(--primary-dark)]">{readinessScore}%</div>
            </div>

            <div>
              <div className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-green)]" />
                {skillsSummary.verified} Verified Skills
              </div>
              <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[var(--accent-saffron)]" />
                {criticalGaps.length} Actionable Gaps
              </div>
            </div>
          </div>
        </div>

        {/* Priority Focus Strip */}
        <div className="mt-5 pt-4 border-t border-[var(--border-warm)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--primary-green)] bg-[var(--surface-subtle)] px-2 py-0.5 rounded border border-[var(--border-warm)]">
              NEXT ACTION
            </span>
            <span className="text-[var(--text-primary)]">
              {criticalGaps.length > 0
                ? `Focus on gap: ${criticalGaps[0].skill} to reach 85%+ readiness.`
                : 'Upload recent R&D project report for verification.'}
            </span>
          </div>

          <Link href="/dashboard/student/skills/gaps">
            <Button size="sm" variant="primary">
              <Zap className="w-3.5 h-3.5" />
              Improve Readiness
            </Button>
          </Link>
        </div>
      </div>

      {/* =========== SIGNATURE SKILL MAP =========== */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-h2 text-[var(--text-primary)] flex items-center gap-2">
            <Brain className="w-5 h-5 text-[var(--primary-dark)]" />
            Skill Intelligence & Gap Pathway
          </h2>
          <Link href="/dashboard/student/skills" className="text-xs font-semibold text-[var(--primary-green)] hover:underline">
            Manage Skill Portfolio →
          </Link>
        </div>

        <SkillMap
          targetRole={targetRole}
          readinessScore={readinessScore}
          skills={mappedSkills.length > 0 ? mappedSkills : undefined}
        />
      </section>

      {/* =========== MAIN SPLIT CONTENT =========== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recommendations / Opportunities (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-h3 text-[var(--text-primary)] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--primary-green)]" />
              Recommended Opportunities
            </h3>
            <Link href="/dashboard/student/opportunities" className="text-xs font-semibold text-[var(--primary-green)] hover:underline">
              View all ({recommendations?.length || 0})
            </Link>
          </div>

          <div className="space-y-4">
            {recommendations && recommendations.length > 0 ? (
              recommendations.slice(0, 2).map((item, idx) => (
                <OpportunityCard
                  key={item.id || idx}
                  id={item.id || `opp-${idx}`}
                  title={item.title || item.role || 'Clinical Research Intern'}
                  companyName={item.companyName || item.company || 'Aster Labs Ayush Division'}
                  location={item.location || 'Bengaluru · Hybrid'}
                  stipend={item.stipend || '₹25,000 / mo'}
                  duration={item.duration || '6 Months'}
                  matchScore={item.score || 82}
                  matchReasons={
                    item.reasons?.map((r) => r.description) || [
                      'Strong in Clinical Methods',
                      'Verified academic coursework',
                    ]
                  }
                />
              ))
            ) : (
              <OpportunityCard
                id="opp-default"
                title="Clinical Trial Research Assistant"
                companyName="All India Institute of Ayurveda R&D"
                location="New Delhi · On-site"
                stipend="₹30,000 / month"
                duration="6 Months"
                matchScore={84}
                matchReasons={[
                  'Strong alignment in Pharmacovigilance',
                  'Faculty recommendation on file',
                ]}
              />
            )}
          </div>
        </div>

        {/* Right Column: Applications & Quick Status (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-h3 text-[#17231F] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#E38B32]" />
              Active Application Status
            </h3>
            <Link href="/dashboard/student/applications" className="text-xs font-semibold text-[#173F35] hover:underline">
              All applications →
            </Link>
          </div>

          {recentApplications && recentApplications.length > 0 ? (
            recentApplications.slice(0, 2).map((app) => (
              <div key={app.id} className="surface-card p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#17231F]">{app.role}</h4>
                    <div className="text-[11px] text-[#58645F]">{app.company}</div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E4ECE7] text-[#173F35]">
                    {app.status}
                  </span>
                </div>
                <ApplicationTimeline currentStage={app.status as any} updatedAt={app.appliedAt} />
              </div>
            ))
          ) : (
            <div className="surface-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#17231F]">Ayush R&D Clinical Associate</h4>
                  <div className="text-[11px] text-[#58645F]">Himalaya Wellness Org</div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E4ECE7] text-[#173F35]">
                  INTERVIEW
                </span>
              </div>
              <ApplicationTimeline currentStage="INTERVIEW" updatedAt="2 days ago" notes="Next round: Technical Interview on Friday, 10:00 AM." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
