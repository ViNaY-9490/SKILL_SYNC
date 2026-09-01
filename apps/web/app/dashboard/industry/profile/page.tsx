'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Save, Check, Globe, Linkedin, ShieldCheck } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function IndustryProfilePage() {
  const [saved, setSaved] = useState(false);
  const [designation, setDesignation] = useState('Lead Technical Recruiter');
  const [bio, setBio] = useState('Building next-gen engineering teams across cloud, AI, and full-stack development.');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/company/skillsync');

  const { data: profile } = useQuery({
    queryKey: ['industry-profile'],
    queryFn: async () => {
      const res = await api.get('/organizations/profile/my');
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      return api.put('/organizations/profile/my', { designation, bio, linkedinUrl });
    },
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Company & Recruiter Profile
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Manage verified industry recruiter profile and company branding credentials.
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Partner
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
        <div>
          <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>
            Designation / Role Title
          </label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>
            Recruiter Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>
            LinkedIn URL
          </label>
          <input
            type="text"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          {saved && <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Updated successfully</span>}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:opacity-90 flex items-center gap-2"
            style={{ background: 'var(--brand)' }}
          >
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
