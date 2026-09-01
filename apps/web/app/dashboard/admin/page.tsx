'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  Building2,
  GraduationCap,
  Brain,
  Briefcase,
  Activity,
  Server,
  Database,
  Cpu,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-h1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            Platform Super Admin Control Center
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            System governance, tenant organization controls, taxonomy management & audit logging.
          </p>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Server, label: 'API Health', value: '100% Operational', sub: 'Latency: 14ms', color: '#10b981' },
          { icon: Database, label: 'Database', value: 'Local Prototype', sub: 'Prisma Client Active', color: '#6172f3' },
          { icon: Cpu, label: 'AI Intelligence Engine', value: 'Active', sub: 'Ollama / Demo Fallback', color: '#f59e0b' },
          { icon: Lock, label: 'Security & RBAC', value: 'Enforced', sub: 'JWT + Refresh Rotation', color: '#ec4899' },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="card p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div className="text-lg font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{value}</div>
            <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* User Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: GraduationCap, label: 'Registered Students', value: '1,248', change: '+14% this month' },
          { icon: Building2, label: 'Industry Partners', value: '42', change: '+5 new companies' },
          { icon: Users, label: 'Faculty Members', value: '86', change: '8 departments' },
          { icon: Briefcase, label: 'Active Opportunities', value: '128', change: 'Jobs & Internships' },
        ].map(({ icon: Icon, label, value, change }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
              <span>{label.toUpperCase()}</span>
              <Icon className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">{change}</div>
          </div>
        ))}
      </div>

      {/* Admin Quick Actions */}
      <div className="card p-6">
        <h2 className="font-bold text-base text-slate-900 dark:text-white mb-4">Platform Administration Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Manage Skill Taxonomy', desc: 'Add new skill nodes, update demand weights, and manage categories.', href: '/dashboard/admin/skills', color: '#6172f3' },
            { title: 'Organization Audits', desc: 'Verify new corporate recruiter accounts and academic institution profiles.', href: '/dashboard/admin/organizations', color: '#10b981' },
            { title: 'System Security Logs', desc: 'Inspect authentication audit trails, failed logins, and RBAC events.', href: '/dashboard/admin/audit', color: '#ec4899' },
          ].map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{action.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
