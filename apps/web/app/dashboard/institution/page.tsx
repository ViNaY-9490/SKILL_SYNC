'use client';

import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Briefcase,
  BarChart3,
  Brain,
  Target,
  Building2,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import Link from 'next/link';

// Sample institutional analytics data (in real app, fetched from /analytics/institution)
const SKILL_DATA = [
  { skill: 'Python', demand: 95, average: 68, gap: 27 },
  { skill: 'JavaScript', demand: 92, average: 72, gap: 20 },
  { skill: 'Machine Learning', demand: 88, average: 42, gap: 46 },
  { skill: 'Docker', demand: 85, average: 38, gap: 47 },
  { skill: 'AWS', demand: 82, average: 31, gap: 51 },
  { skill: 'React', demand: 80, average: 65, gap: 15 },
  { skill: 'SQL', demand: 90, average: 70, gap: 20 },
];

const READINESS_DISTRIBUTION = [
  { label: 'Placement Ready (80+)', count: 34, color: '#22c55e' },
  { label: 'Almost Ready (60-79)', count: 67, color: '#f59e0b' },
  { label: 'Building Skills (40-59)', count: 89, color: '#6172f3' },
  { label: 'Early Stage (<40)', count: 45, color: '#ef4444' },
];

const RADAR_DATA = [
  { subject: 'Backend', A: 65, fullMark: 100 },
  { subject: 'Frontend', A: 72, fullMark: 100 },
  { subject: 'Database', A: 70, fullMark: 100 },
  { subject: 'Cloud', A: 35, fullMark: 100 },
  { subject: 'AI/ML', A: 42, fullMark: 100 },
  { subject: 'Security', A: 48, fullMark: 100 },
];

const PLACEMENT_STATS = [
  { month: 'Aug', placed: 12, applied: 45 },
  { month: 'Sep', placed: 28, applied: 82 },
  { month: 'Oct', placed: 45, applied: 120 },
  { month: 'Nov', placed: 38, applied: 98 },
  { month: 'Dec', placed: 62, applied: 150 },
];

function StatCard({ icon: Icon, label, value, sub, change, color = '#6172f3' }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  change?: string;
  color?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            {change}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold mb-0.5" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          {value}
        </div>
        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function InstitutionDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-h1" style={{ color: 'var(--text-primary)' }}>Institution Analytics</h1>
          <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
            <Building2 className="w-4 h-4" />
            Vishnu Institute of Technology, Bhimavaram — Training & Placement Cell
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/institution/reports"
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              background: 'var(--surface-0)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
            }}
          >
            Export Report
          </Link>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={GraduationCap} label="Total Students" value="235" sub="Final year CSE" change="+12%" color="#6172f3" />
        <StatCard icon={Briefcase} label="Offers This Season" value="62" sub="41% placement rate" change="+18%" color="#10b981" />
        <StatCard icon={Target} label="Avg Readiness" value="64%" sub="Up from 58% last quarter" change="+6pts" color="#f59e0b" />
        <StatCard icon={Building2} label="Companies" value="28" sub="Active recruiters" change="+5" color="#ec4899" />
      </div>

      {/* Skill Intelligence Section */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Skill Gap Heatmap */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Skill Gap Analysis (vs Industry Demand)
            </h2>
          </div>
          <div className="space-y-3">
            {SKILL_DATA.slice(0, 6).map((skill) => (
              <div key={skill.skill}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{skill.skill}</span>
                  <span className="font-semibold" style={{ color: skill.gap > 40 ? '#dc2626' : skill.gap > 20 ? '#d97706' : '#16a34a' }}>
                    Gap: {skill.gap}pts
                  </span>
                </div>
                <div className="relative h-6 rounded-lg overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                  {/* Industry demand bar */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-lg opacity-20"
                    style={{ width: `${skill.demand}%`, background: '#6172f3' }}
                  />
                  {/* Average student bar */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-lg"
                    style={{ width: `${skill.average}%`, background: '#6172f3' }}
                  />
                  <div className="absolute inset-0 flex items-center px-2 gap-2">
                    <span className="text-xs font-medium text-white">{skill.average}%</span>
                    <span className="text-xs text-white opacity-60">/ {skill.demand}% demand</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>
            Bar = batch average · Light overlay = industry demand
          </p>
        </div>

        {/* Skill Radar */}
        <div className="card p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Brain className="w-4 h-4" style={{ color: 'var(--brand)' }} />
            Batch Skill Coverage
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="var(--border-subtle)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <Radar
                name="Avg Student Score"
                dataKey="A"
                stroke="#6172f3"
                fill="#6172f3"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-xs text-center mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Average proficiency across domains (sample data)
          </p>
        </div>
      </div>

      {/* Placement Analytics + Readiness */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Placement Trend */}
        <div className="md:col-span-2 card p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <TrendingUp className="w-4 h-4" style={{ color: '#10b981' }} />
            Placement Activity (this season)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={PLACEMENT_STATS} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface-0)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                }}
              />
              <Bar dataKey="applied" name="Applications" fill="#c7d7fe" radius={4} />
              <Bar dataKey="placed" name="Placed" fill="#6172f3" radius={4} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
            🔵 Placed · 🔷 Applications · Sample data for demo
          </p>
        </div>

        {/* Readiness Distribution */}
        <div className="card p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <BarChart3 className="w-4 h-4" style={{ color: '#f59e0b' }} />
            Readiness Distribution
          </h2>
          <div className="space-y-3">
            {READINESS_DISTRIBUTION.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.count}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(item.count / 235) * 100}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" style={{ color: '#10b981' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                101 students (43%) placement-ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Demand Insights */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <TrendingUp className="w-4 h-4" style={{ color: '#6172f3' }} />
            Industry Skill Demand (Top skills recruiters are searching for)
          </h2>
          <Link href="/dashboard/institution/skills" className="text-xs font-semibold" style={{ color: 'var(--brand)' }}>
            Full analytics →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Python', demand: 95, trend: '↑', color: '#6172f3' },
            { name: 'LLMs / GenAI', demand: 95, trend: '↑↑', color: '#10b981' },
            { name: 'Docker', demand: 92, trend: '↑', color: '#f59e0b' },
            { name: 'AWS', demand: 90, trend: '↑', color: '#ec4899' },
            { name: 'Machine Learning', demand: 88, trend: '↑', color: '#6172f3' },
            { name: 'SQL', demand: 88, trend: '→', color: '#10b981' },
            { name: 'React', demand: 85, trend: '→', color: '#f59e0b' },
            { name: 'TypeScript', demand: 82, trend: '↑', color: '#6366f1' },
          ].map((skill) => (
            <div
              key={skill.name}
              className="p-3 rounded-xl text-center"
              style={{ background: `${skill.color}08`, border: `1px solid ${skill.color}20` }}
            >
              <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{skill.name}</div>
              <div className="flex items-center justify-center gap-1.5">
                <div className="h-1.5 rounded-full flex-1" style={{ background: 'var(--surface-2)', maxWidth: '60px' }}>
                  <div className="h-full rounded-full" style={{ width: `${skill.demand}%`, background: skill.color }} />
                </div>
                <span className="text-xs font-bold" style={{ color: skill.color }}>{skill.trend}</span>
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Demand: {skill.demand}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
