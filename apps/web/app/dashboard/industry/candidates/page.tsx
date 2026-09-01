'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Award, CheckCircle, Star, Sparkles, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function CandidateSearchPage() {
  const [skillSearch, setSkillSearch] = useState('');
  const [minReadiness, setMinReadiness] = useState(70);

  const { data: candidates, isLoading } = useQuery({
    queryKey: ['candidates-search', skillSearch, minReadiness],
    queryFn: async () => {
      const res = await api.get(`/organizations/candidates/search?skills=${skillSearch}&minReadiness=${minReadiness}`);
      return res.data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Candidate Intelligence Search
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Search and discover verified student candidates based on verified skill proficiency and placement readiness.
        </p>
      </div>

      {/* Filter controls */}
      <div className="p-5 rounded-2xl border space-y-4" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>
              Filter by Skills (comma separated)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3" style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="React, Node.js, Python, PostgreSQL..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border outline-none"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold uppercase" style={{ color: 'var(--text-tertiary)' }}>
                Minimum Readiness Score: <span className="text-emerald-600 font-bold">{minReadiness}%</span>
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={minReadiness}
              onChange={(e) => setMinReadiness(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500 bg-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-2xl animate-pulse" style={{ background: 'var(--surface-0)' }} />
          ))}
        </div>
      ) : candidates?.length === 0 ? (
        <div className="text-center py-12 p-8 rounded-2xl border" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" style={{ color: 'var(--brand)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>No candidates match criteria</h3>
          <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Try lowering the minimum readiness threshold or widening your skill filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidates?.map((candidate: any) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl border space-y-4 transition-all hover:shadow-md"
              style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                    {candidate.firstName?.[0] || 'S'}
                  </div>
                  <div>
                    <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                      {candidate.firstName} {candidate.lastName}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {candidate.user?.email || 'Computer Science Student'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    <Sparkles className="w-3 h-3" />
                    {candidate.placementReadinessScore || 82}% Match
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills?.slice(0, 5).map((s: any) => (
                  <span key={s.id || s.skill?.name} className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    {s.skill?.name || 'Skill'}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t flex justify-end" style={{ borderColor: 'var(--border-subtle)' }}>
                <button className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90" style={{ background: 'var(--brand)' }}>
                  Invite for Opportunity
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
