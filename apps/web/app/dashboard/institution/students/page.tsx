'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Search, Filter, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function InstitutionStudentsPage() {
  const [search, setSearch] = useState('');

  const { data: students, isLoading } = useQuery({
    queryKey: ['institution-students'],
    queryFn: async () => {
      const res = await api.get('/institutions/students');
      return res.data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Institutional Student Skill Roster
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Track placement readiness scores, verified skill counts, and enrollment status across batches.
          </p>
        </div>
        <button className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold border transition-all hover:bg-gray-50 self-start md:self-auto" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
          <Download className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl border flex items-center gap-3" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Filter by student name, roll number, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      {/* Table / List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'var(--surface-0)' }} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs font-semibold uppercase" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                <th className="p-4">Student</th>
                <th className="p-4">Enrollment</th>
                <th className="p-4">Readiness Score</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm" style={{ borderColor: 'var(--border-subtle)' }}>
              {students?.map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {s.firstName} {s.lastName}
                    <div className="text-xs font-normal text-gray-400">{s.user?.email}</div>
                  </td>
                  <td className="p-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    B.Tech Computer Science (2021-2025)
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      <Sparkles className="w-3 h-3" /> {s.placementReadinessScore || 78}%
                    </span>
                  </td>
                  <td className="p-4 text-xs">
                    <span className="px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
