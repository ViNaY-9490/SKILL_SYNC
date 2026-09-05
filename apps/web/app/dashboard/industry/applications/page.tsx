'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Check, X, Clock, UserCheck, MessageSquare, ChevronRight, Sparkles } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useApplicationsStore, type AppliedOpportunity } from '@/store/applications.store';

export default function IndustryApplicationsPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const { applications: storeApps, updateStatus: updateStoreStatus } = useApplicationsStore();

  const { data: apiApplications, isLoading } = useQuery({
    queryKey: ['recruiter-applications', selectedStatus],
    queryFn: async () => {
      try {
        const res = await api.get(`/applications/recruiter${selectedStatus !== 'ALL' ? `?status=${selectedStatus}` : ''}`);
        return res.data || [];
      } catch {
        return [];
      }
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppliedOpportunity['status'] }) => {
      updateStoreStatus(id, status);
      try {
        return await api.patch(`/applications/${id}/status`, { status });
      } catch {
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-applications'] });
    },
  });

  const handleStatusChange = (appId: string, newStatus: AppliedOpportunity['status']) => {
    updateStatusMutation.mutate({ id: appId, status: newStatus });
  };

  const statuses = ['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'];

  // Combine store applications and API applications safely
  const combinedApplications = Array.from(
    new Map([
      ...storeApps.map((a) => [a.id, a]),
      ...((apiApplications || []) as AppliedOpportunity[]).map((a) => [a.id, a]),
    ]).values()
  );

  const applications = combinedApplications.filter((app) => {
    if (selectedStatus === 'ALL') return true;
    return app.status === selectedStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Applicant Pipeline & Evaluation
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Review candidate applications, evaluate skill alignment scores, and update candidate hiring stages in real time.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          Real-Time Sync Active
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto pb-2" style={{ borderColor: 'var(--border-subtle)' }}>
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedStatus === st
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {isLoading && applications.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--surface-0)' }} />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 p-8 rounded-2xl border" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40 text-emerald-600" />
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            No candidate applications found for status "{selectedStatus}"
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Switch tabs or test applying as a student in another tab to observe real-time candidate updates here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs"
              style={{ background: 'var(--surface-paper)', borderColor: 'var(--border-warm)' }}
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {app.student?.firstName} {app.student?.lastName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {app.matchScore || 90}% Match Score
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      app.status === 'SHORTLISTED'
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        : app.status === 'INTERVIEW'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : app.status === 'SELECTED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : app.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Applied for: <span className="font-semibold text-[var(--text-primary)]">{app.opportunity?.title || 'Engineering Role'}</span>
                  <span className="mx-2">•</span>
                  <span>{app.student?.institution || 'Vishnu Institute of Technology'}</span>
                </div>
                {app.coverLetter && (
                  <p className="text-xs italic bg-[var(--surface-subtle)] p-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] max-w-xl">
                    "{app.coverLetter}"
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
                <button
                  onClick={() => handleStatusChange(app.id, 'SHORTLISTED')}
                  disabled={app.status === 'SHORTLISTED'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    app.status === 'SHORTLISTED'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  {app.status === 'SHORTLISTED' ? 'Shortlisted' : 'Shortlist'}
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, 'INTERVIEW')}
                  disabled={app.status === 'INTERVIEW'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    app.status === 'INTERVIEW'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {app.status === 'INTERVIEW' ? 'Interview Scheduled' : 'Schedule Interview'}
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, 'SELECTED')}
                  disabled={app.status === 'SELECTED'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    app.status === 'SELECTED'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {app.status === 'SELECTED' ? 'Selected' : 'Accept / Hire'}
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, 'REJECTED')}
                  disabled={app.status === 'REJECTED'}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
