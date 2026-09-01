'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, Search, Filter, Eye, Users, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function IndustryOpportunitiesPage() {
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['industry-opportunities', search],
    queryFn: async () => {
      const res = await api.get('/opportunities');
      return res.data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Opportunity Management
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Post and manage job opportunities, internships, live projects, and apprenticeships.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all shadow-md hover:opacity-90 self-start md:self-auto"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
        >
          <Plus className="w-4 h-4" />
          Post New Opportunity
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-3 items-center justify-between p-4 rounded-2xl border" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-3" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search opportunity title, skills, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border outline-none transition-all"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* Opportunities List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'var(--surface-0)' }} />
          ))}
        </div>
      ) : opportunities?.length === 0 ? (
        <div className="text-center py-12 p-8 rounded-2xl border" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-40" style={{ color: 'var(--brand)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>No active postings found</h3>
          <p className="text-xs mt-1 max-w-sm mx-auto" style={{ color: 'var(--text-tertiary)' }}>
            Start recruiting verified talent by posting your first internship or full-time position.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {opportunities?.map((op: any) => (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl border transition-all hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-emerald-100 text-emerald-800">
                    {op.type || 'INTERNSHIP'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {op.workMode || 'REMOTE'}
                  </span>
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {op.title}
                </h3>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {op.applicationCount || 12} Applicants</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {op.stipend || op.salary || 'Competitive'}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Deadline: {op.applicationDeadline ? new Date(op.applicationDeadline).toLocaleDateString() : 'Rolling'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:bg-gray-50" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
                  View Applicants
                </button>
                <button className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90" style={{ background: 'var(--brand)' }}>
                  Edit Posting
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
