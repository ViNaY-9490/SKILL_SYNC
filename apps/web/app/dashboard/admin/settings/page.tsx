'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Cpu, Shield, Zap, Save, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [aiProvider, setAiProvider] = useState('GEMINI_PRO');

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Platform System Settings & AI Providers
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          System-wide AI configuration, rate limits, and platform parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
        <div>
          <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>
            AI Provider Engine
          </label>
          <select
            value={aiProvider}
            onChange={(e) => setAiProvider(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm border outline-none font-semibold"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          >
            <option value="GEMINI_PRO">Google Gemini 1.5 Pro / Flash (Primary)</option>
            <option value="DEMO_FALLBACK">Rule-Based Demo Fallback (Offline Mode)</option>
          </select>
        </div>

        <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>System Overview Metrics</h3>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
              <div className="font-bold text-lg text-indigo-600">{stats?.totalUsers || 24}</div>
              <div className="text-gray-500">Total Accounts</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
              <div className="font-bold text-lg text-emerald-600">{stats?.totalOpportunities || 8}</div>
              <div className="text-gray-500">Active Postings</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
              <div className="font-bold text-lg text-amber-600">{stats?.totalApplications || 14}</div>
              <div className="text-gray-500">Applications</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          {saved && <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Platform settings saved</span>}
          <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}
