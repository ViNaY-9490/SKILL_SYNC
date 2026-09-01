'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Target, Zap, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function IndustryAnalyticsPage() {
  const { data: demandData } = useQuery({
    queryKey: ['analytics-demand'],
    queryFn: async () => {
      const res = await api.get('/analytics/industry-demand');
      return res.data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Recruitment & Skill Demand Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Real-time intelligence on candidate supply vs market skill demand.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-tertiary)' }}>Candidate Conversion</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold mt-2 text-emerald-600">34.8%</div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>+4.2% vs last batch</p>
        </div>

        <div className="p-5 rounded-2xl border" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-tertiary)' }}>Avg Skill Match Score</span>
            <Target className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold mt-2 text-indigo-600">84.2%</div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>High alignment across top applicants</p>
        </div>

        <div className="p-5 rounded-2xl border" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-tertiary)' }}>Time-to-Shortlist</span>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold mt-2 text-amber-600">1.8 Days</div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Powered by SkillSync AI matching</p>
        </div>
      </div>

      {/* Top Demand Breakdown */}
      <div className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Top In-Demand Skills</h3>
        <div className="space-y-3">
          {demandData?.slice(0, 5).map((item: any, idx: number) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span style={{ color: 'var(--text-primary)' }}>{item.skill}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{item.openOpportunities || 12} Open Roles / {item.skilledStudents || 45} Skilled Students</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                  style={{ width: `${Math.min(100, (item.demandScore || 70))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
