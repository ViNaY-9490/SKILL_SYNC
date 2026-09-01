'use client';

import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function InstitutionSkillsPage() {
  const { data: matrix } = useQuery({
    queryKey: ['institution-skill-matrix'],
    queryFn: async () => {
      const res = await api.get('/institutions/skill-matrix');
      return res.data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Curriculum vs Industry Skill Gap Matrix
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Identify gaps between academic syllabus coverage and real-time industry hiring demand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matrix?.map((item: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl border space-y-3"
            style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{item.skill}</h3>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Demand Score: {item.demandLevel}/100</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.gapIndex > 10 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {item.gapIndex > 10 ? 'Curriculum Deficit' : 'Well Aligned'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-gray-500">
                <span>Student Supply: {item.studentCount}</span>
                <span>Industry Roles: {item.opportunityCount}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, item.demandLevel)}%` }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
