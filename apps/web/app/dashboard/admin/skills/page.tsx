'use client';

import { motion } from 'framer-motion';
import { Brain, Plus, Search, GitFork, Sliders } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function AdminSkillsPage() {
  const { data: demandSkills } = useQuery({
    queryKey: ['admin-skills'],
    queryFn: async () => {
      const res = await api.get('/analytics/industry-demand');
      return res.data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Skill Graph & Taxonomy Management
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Manage skill nodes, categories, ESCO reference mappings, and market demand weights.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Skill Taxonomy Node
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demandSkills?.map((skill: any, idx: number) => (
          <motion.div key={idx} className="p-5 rounded-2xl border space-y-3" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{skill.skill}</h3>
                <p className="text-xs text-indigo-600 font-semibold">{skill.category}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                Demand: {skill.demandScore}/100
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Student Profile Count: {skill.skilledStudents}</span>
              <span>Active Job Opportunities: {skill.openOpportunities}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
