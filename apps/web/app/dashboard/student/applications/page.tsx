'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Building2,
  Clock,
  CheckCircle2,
  Search,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { ApplicationTimeline } from '@/components/ui/application-timeline';
import { Button } from '@/components/ui/button';
import { useApplicationsStore } from '@/store/applications.store';

const STATUS_TABS = [
  { id: 'ALL', label: 'All Applications' },
  { id: 'SHORTLISTED', label: 'Shortlisted' },
  { id: 'APPLIED', label: 'Applied' },
  { id: 'INTERVIEW', label: 'Interview' },
  { id: 'SELECTED', label: 'Selected' },
];

const STATUS_COLORS: Record<string, string> = {
  APPLIED: 'bg-[var(--surface-subtle)] text-[var(--primary-green)] border-[var(--border-warm)]',
  SHORTLISTED: 'bg-amber-950/40 text-amber-300 border-amber-800',
  INTERVIEW: 'bg-indigo-950/40 text-indigo-300 border-indigo-800',
  SELECTED: 'bg-emerald-950/40 text-emerald-300 border-emerald-800',
  REJECTED: 'bg-red-950/40 text-red-300 border-red-800',
};

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');

  const { applications } = useApplicationsStore();

  const filtered = applications.filter((app) => {
    const matchesTab = activeTab === 'ALL' || app.status === activeTab;
    const matchesSearch =
      app.opportunity.title.toLowerCase().includes(search.toLowerCase()) ||
      app.opportunity.organization.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-warm)]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-green)] mb-0.5">
            Recruitment Outcomes
          </div>
          <h1 className="text-h1 flex items-center gap-2 text-[var(--text-primary)]">
            <Briefcase className="w-6 h-6 text-[var(--primary-dark)]" />
            Application Progression Tracker
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Monitor real-time stage progression, shortlists, and decision timelines.
          </p>
        </div>

        <Link href="/dashboard/student/opportunities">
          <Button variant="primary" size="sm">
            Explore Opportunities
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface-paper)] p-3 rounded-lg border border-[var(--border-warm)]">
        <div className="flex items-center gap-1 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[var(--primary-dark)] text-[var(--text-inverse)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
              {tab.id !== 'ALL' && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  ({applications.filter((a) => a.status === tab.id).length})
                </span>
              )}
              {tab.id === 'ALL' && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  ({applications.length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applications..."
            className="w-full pl-9 pr-4 py-1.5 rounded-md text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-dark)]"
          />
        </div>
      </div>

      {/* Applications List */}
      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filtered.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="surface-card p-5 space-y-4 bg-[var(--surface-paper)] border border-[var(--border-warm)] rounded-xl hover:border-[var(--primary-green)] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Company Avatar */}
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary-dark)] text-[var(--text-inverse)] font-bold flex items-center justify-center text-base flex-shrink-0 shadow-sm">
                      {app.opportunity.organization.name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-[var(--text-primary)]">
                        {app.opportunity.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-[var(--primary-green)]">
                          {app.opportunity.organization.name}
                        </span>
                        <span className="text-[var(--text-tertiary)]">•</span>
                        <span>{app.opportunity.type}</span>
                        {app.opportunity.location && (
                          <>
                            <span className="text-[var(--text-tertiary)]">•</span>
                            <span>📍 {app.opportunity.location}</span>
                          </>
                        )}
                        <span className="text-[var(--text-tertiary)]">•</span>
                        <span className="text-[var(--text-tertiary)]">
                          Applied {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Match Score */}
                    <div className="text-right bg-[var(--surface-subtle)] px-2.5 py-1 rounded border border-[var(--border-warm)]">
                      <div className="text-[10px] font-bold text-[var(--text-tertiary)] flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-[var(--accent-saffron)]" />
                        MATCH
                      </div>
                      <div className="text-xs font-bold text-[var(--primary-green)]">{app.matchScore}%</div>
                    </div>

                    {/* Status Badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded border ${STATUS_COLORS[app.status] || STATUS_COLORS.APPLIED}`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Stage Progress Timeline */}
                <ApplicationTimeline
                  currentStage={app.status as any}
                  updatedAt={new Date(app.appliedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="surface-card p-12 text-center bg-[var(--surface-paper)] border border-[var(--border-warm)] rounded-xl"
          >
            <Briefcase className="w-10 h-10 text-[var(--text-tertiary)] mx-auto mb-3" />
            <h3 className="text-h3 text-[var(--text-primary)]">No Applications Found</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 mb-5">
              {search
                ? 'No applications match your search query.'
                : activeTab !== 'ALL'
                ? `No applications with status "${activeTab}" yet.`
                : 'You haven\'t applied to any opportunities yet. Go explore!'}
            </p>
            <Link href="/dashboard/student/opportunities">
              <Button variant="primary" size="sm">
                Browse Opportunities
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
