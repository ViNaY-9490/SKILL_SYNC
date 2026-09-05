'use client';

import { motion } from 'framer-motion';
import { Briefcase, ShieldAlert, CheckCircle2, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function AdminOpportunitiesPage() {
  const { data: rawData } = useQuery({
    queryKey: ['admin-opportunities'],
    queryFn: async () => {
      const res = await api.get('/opportunities');
      return res.data;
    },
  });

  const opportunities: any[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.opportunities)
    ? rawData.opportunities
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Global Opportunity Moderation
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Oversight of all posted jobs, internships, and live projects across recruiters.
        </p>
      </div>

      <div className="space-y-3">
        {opportunities.map((op: any) => (
          <div key={op.id} className="p-5 rounded-2xl border flex justify-between items-center" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
            <div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{op.title}</h3>
              <p className="text-xs text-gray-500">Type: {op.type} | Organization: {op.organization?.name || 'Company'}</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" /> Remove Posting
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
