'use client';

import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Briefcase,
  BarChart3,
  Star,
  Plus,
  ArrowRight,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SAMPLE_CANDIDATES = [
  { name: 'Aarav Sharma', role: 'Backend Developer Intern', match: 92, skills: ['Python', 'SQL', 'REST API'], status: 'Shortlisted' },
  { name: 'Priya Nair', role: 'Full Stack Engineer Associate', match: 87, skills: ['React', 'TypeScript', 'Node.js'], status: 'Applied' },
  { name: 'Rohan Patel', role: 'DevOps & Cloud Engineer Intern', match: 79, skills: ['Docker', 'AWS', 'Linux'], status: 'Applied' },
];

export default function IndustryDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDE2DC]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#256B58] mb-0.5">
            Industry Partner Portal
          </div>
          <h1 className="text-h1 text-[#17231F]">Apex Cloud Systems & Engineering</h1>
          <p className="text-xs text-[#58645F] mt-0.5">
            Discover verified talent matched to institutional competency requirements.
          </p>
        </div>

        <Link href="/dashboard/industry/opportunities/new">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4" />
            Publish Opportunity
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Briefcase, label: 'Active Listings', value: 4 },
          { icon: Users, label: 'Candidate Applicants', value: 24 },
          { icon: Star, label: 'Shortlisted Candidates', value: 6 },
          { icon: TrendingUp, label: 'Avg Competency Match', value: '82%' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="surface-card p-4">
            <div className="w-8 h-8 rounded-lg bg-[#E4ECE7] text-[#173F35] flex items-center justify-center mb-2">
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold text-[#17231F]">{value}</div>
            <div className="text-xs text-[#58645F]">{label}</div>
          </div>
        ))}
      </div>

      {/* Content Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Candidates */}
        <div className="surface-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#17231F]">Top Skill-Matched Candidates</h2>
            <Link href="/dashboard/industry/candidates" className="text-xs font-semibold text-[#173F35] hover:underline">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {SAMPLE_CANDIDATES.map((candidate) => (
              <div
                key={candidate.name}
                className="p-3 rounded-lg bg-[#FCFBF7] border border-[#EBEFEA] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#173F35] text-[#FCFBF7] font-bold text-xs flex items-center justify-center">
                    {candidate.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#17231F]">{candidate.name}</div>
                    <div className="text-[11px] text-[#58645F]">{candidate.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#256B58]">{candidate.match}%</span>
                    <div className="text-[10px] text-[#829189]">Match</div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E4ECE7] text-[#173F35]">
                    {candidate.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="surface-card p-5 space-y-4">
          <h2 className="font-bold text-sm text-[#17231F]">Recruiter Quick Actions</h2>
          <div className="space-y-2.5">
            {[
              { label: 'Publish new internship / placement', href: '/dashboard/industry/opportunities/new' },
              { label: 'Browse verified student talent pool', href: '/dashboard/industry/candidates' },
              { label: 'Review institutional skill demand analytics', href: '/dashboard/industry/analytics' },
              { label: 'Manage active candidate applications', href: '/dashboard/industry/applications' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center justify-between p-3 rounded-lg bg-[#FCFBF7] border border-[#EBEFEA] hover:border-[#A7BDAF] text-xs font-medium text-[#17231F] transition-all"
              >
                <span>{action.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#829189]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
