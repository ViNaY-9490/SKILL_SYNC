'use client';

import { motion } from 'framer-motion';
import { Briefcase, Calendar, Plus, Users, Building } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function InstitutionPlacementPage() {
  const { data: drives } = useQuery({
    queryKey: ['placement-drives'],
    queryFn: async () => {
      const res = await api.get('/institutions/placements');
      return res.data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Campus Placement Drives & Recruitment Campaigns
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Schedule and manage drive campaigns with corporate recruitment partners.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {drives?.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
            <Briefcase className="w-12 h-12 mx-auto text-pink-500 mb-2 opacity-50" />
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>No active campus drives</h3>
            <p className="text-xs text-gray-500 mt-1">Upcoming drive schedules will appear here.</p>
          </div>
        ) : (
          drives?.map((drive: any) => (
            <div key={drive.id} className="p-5 rounded-2xl border flex justify-between items-center" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
              <div>
                <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{drive.title}</h3>
                <p className="text-xs text-gray-500">Status: {drive.status || 'UPCOMING'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
