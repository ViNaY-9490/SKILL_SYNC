'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Plus,
  Brain,
  ShieldCheck,
  Zap,
  Target,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudentSkill {
  id: string;
  name: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  verified: boolean;
}

const INITIAL_SKILLS: StudentSkill[] = [
  { id: 's1', name: 'Python & Data Structures', category: 'Backend', level: 'ADVANCED', verified: true },
  { id: 's2', name: 'SQL & PostgreSQL', category: 'Database', level: 'INTERMEDIATE', verified: true },
  { id: 's3', name: 'REST API Design', category: 'Backend', level: 'INTERMEDIATE', verified: true },
  { id: 's4', name: 'Docker & Containerization', category: 'Cloud & DevOps', level: 'INTERMEDIATE', verified: false },
  { id: 's5', name: 'System Design & Architecture', category: 'Architecture', level: 'INTERMEDIATE', verified: true },
];

export default function ReadinessPage() {
  const [skills, setSkills] = useState<StudentSkill[]>(INITIAL_SKILLS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Research');
  const [newSkillLevel, setNewSkillLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('INTERMEDIATE');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const skillObj: StudentSkill = {
      id: `sk_${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
      verified: false,
    };

    setSkills((prev) => [skillObj, ...prev]);
    setNewSkillName('');
    setIsAddModalOpen(false);
  };

  const verifiedCount = skills.filter((s) => s.verified).length;
  const readinessScore = Math.min(68 + skills.length * 3 + verifiedCount * 2, 98);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-warm)]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-green)] mb-0.5">
            Placement Employability Index
          </div>
          <h1 className="text-h1 flex items-center gap-2 text-[var(--text-primary)]">
            <TrendingUp className="w-6 h-6 text-[var(--primary-dark)]" />
            Institutional Readiness Index
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Employability rating based on verified competencies, coursework, and trial benchmarks.
          </p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} variant="primary" size="sm">
          <Plus className="w-4 h-4" /> Add Skill to Profile
        </Button>
      </div>

      {/* Main Readiness Metric Banner */}
      <div className="surface-card p-6 bg-[var(--primary-dark)] text-[var(--text-inverse)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sage-muted)]">
              Overall Employability Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold">{readinessScore}%</span>
              <span className="text-xs text-[var(--sage-muted)]">/ 100</span>
            </div>
            <p className="text-xs text-[var(--sage-muted)]">High Placement Potential · Tier 1 Hiring Ready</p>
          </div>

          <div className="col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Technical Core', value: '88%', status: 'VERIFIED' },
              { label: 'System Design', value: '72%', status: 'IMPROVING' },
              { label: 'Projects & Code', value: '85%', status: 'VERIFIED' },
              { label: 'Soft Skills', value: '80%', status: 'GOOD' },
            ].map((pillar) => (
              <div key={pillar.label} className="p-3 rounded-lg bg-[var(--surface-paper)]/10 border border-[#2A594D]">
                <div className="text-[11px] text-[var(--sage-muted)]">{pillar.label}</div>
                <div className="text-lg font-bold text-[var(--text-inverse)] mt-0.5">{pillar.value}</div>
                <div className="text-[10px] font-bold text-[var(--accent-saffron)]">{pillar.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Profile Section */}
      <div className="surface-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
              <Brain className="w-4 h-4 text-[var(--primary-dark)]" />
              Verified Competency Matrix ({skills.length})
            </h2>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[var(--surface-subtle)] text-[var(--primary-dark)] flex items-center gap-1 border border-[var(--border-warm)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary-green)]" /> {verifiedCount} Verified Badges
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="p-3.5 rounded-lg bg-[var(--surface-paper)] border border-[var(--border-subtle)] flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs text-[var(--text-primary)]">{skill.name}</h3>
                  {skill.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-green)]" />
                  )}
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{skill.category}</p>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--surface-subtle)] text-[var(--primary-dark)]">
                {skill.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Skill Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--surface-paper)] p-6 rounded-xl max-w-md w-full border border-[var(--border-warm)] shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[var(--primary-dark)]" /> Add Competency
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSkill} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Competency Name</label>
                  <input
                    type="text"
                    required
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g. Ayush Safety Reporting"
                    className="w-full px-3 py-2 rounded-md text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Category</label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-md text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none"
                  >
                    <option value="Research">Research</option>
                    <option value="Regulatory">Regulatory</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save Competency
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
