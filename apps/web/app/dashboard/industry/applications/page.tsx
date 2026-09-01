'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Check, X, Clock, UserCheck, MessageSquare, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function IndustryApplicationsPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const { data: applications, isLoading } = useQuery({
    queryKey: ['recruiter-applications', selectedStatus],
    queryFn: async () => {
      const res = await api.get(`/applications/recruiter${selectedStatus !== 'ALL' ? `?status=${selectedStatus}` : ''}`);
      return res.data || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return api.patch(`/applications/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-applications'] });
    },
  });

  const statuses = ['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFER_MADE', 'REJECTED'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Applicant Pipeline
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Review candidate applications, evaluate skill alignment, and advance candidates through hiring stages.
        </p>
      </div>

      {/* Stage Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto pb-2" style={{ borderColor: 'var(--border-subtle)' }}>
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStatus === st
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--surface-0)' }} />
          ))}
        </div>
      ) : applications?.length === 0 ? (
        <div className="text-center py-12 p-8 rounded-2xl border" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" style={{ color: 'var(--brand)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>No applications in this stage</h3>
        </div>
      ) : (
        <div className="space-y-3">
          {applications?.map((app: any) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {app.student?.firstName} {app.student?.lastName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                    {app.matchScore || 85}% Match
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Applied for: <span className="font-semibold">{app.opportunity?.title || 'Full Stack Engineer'}</span>
                </p>
                {app.coverLetter && (
                  <p className="text-xs italic bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg text-gray-600 dark:text-gray-300">
                    "{app.coverLetter}"
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'SHORTLISTED' })}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Shortlist
                </button>
                <button
                  onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'INTERVIEW' })}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center gap-1"
                >
                  Schedule Interview
                </button>
                <button
                  onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'REJECTED' })}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600"
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
