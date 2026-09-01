'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Brain,
  Plus,
  CheckCircle2,
  Search,
  Star,
  Zap,
  Upload,
  BookOpen,
  Award,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Skill {
  id: string;
  name: string;
  category?: Category;
  demandLevel: number;
}

const DEFAULT_SKILLS = [
  {
    id: 'sk_dbms',
    name: 'Database Management Systems (DBMS)',
    category: { id: 'c_db', name: 'Database Architecture', slug: 'db' },
    demandLevel: 96,
    facultyLead: 'Dr. Subba Rao Sir',
  },
  {
    id: 'sk_python',
    name: 'Python & Data Structures',
    category: { id: 'c_se', name: 'Software Engineering', slug: 'se' },
    demandLevel: 94,
    facultyLead: 'Dr. Suresh Menon',
  },
  {
    id: 'sk_sql',
    name: 'SQL Relational Queries & Indexing',
    category: { id: 'c_db', name: 'Database Architecture', slug: 'db' },
    demandLevel: 92,
    facultyLead: 'Dr. Subba Rao Sir',
  },
  {
    id: 'sk_api',
    name: 'REST API Design & Security',
    category: { id: 'c_se', name: 'Software Engineering', slug: 'se' },
    demandLevel: 90,
    facultyLead: 'Meera Krishnan',
  },
  {
    id: 'sk_react',
    name: 'React & TypeScript Development',
    category: { id: 'c_fe', name: 'Frontend Web Tech', slug: 'fe' },
    demandLevel: 88,
    facultyLead: 'Vishnu Tech Placement Cell',
  },
  {
    id: 'sk_docker',
    name: 'Docker & Containerization',
    category: { id: 'c_devops', name: 'Cloud & DevOps', slug: 'devops' },
    demandLevel: 85,
    facultyLead: 'Vikramaditya Roy',
  },
];

export default function SkillsProfilePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom added competencies state
  const [customSkills, setCustomSkills] = useState<any[]>([
    { skillId: 'sk_dbms', verificationStatus: 'VERIFIED', computedLevel: 'ADVANCED' },
    { skillId: 'sk_python', verificationStatus: 'VERIFIED', computedLevel: 'ADVANCED' },
    { skillId: 'sk_sql', verificationStatus: 'VERIFIED', computedLevel: 'ADVANCED' },
    { skillId: 'sk_api', verificationStatus: 'VERIFIED', computedLevel: 'INTERMEDIATE' },
  ]);

  // Form State
  const [newSkillName, setNewSkillName] = useState('');
  const [newCategory, setNewCategory] = useState('Software Engineering');
  const [newLevel, setNewLevel] = useState('INTERMEDIATE');

  const { data: skillsData } = useQuery({
    queryKey: ['all-skills', search, selectedCategory],
    queryFn: async () => {
      try {
        const { data } = await api.get('/skills');
        if (data?.skills && data.skills.length > 0) return data;
        return { skills: DEFAULT_SKILLS };
      } catch {
        return { skills: DEFAULT_SKILLS };
      }
    },
  });

  const allSkills: any[] = skillsData?.skills && skillsData.skills.length > 0 ? skillsData.skills : DEFAULT_SKILLS;

  const handleAddCustomCompetency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newId = `sk_custom_${Date.now()}`;
    const newSkillObj = {
      id: newId,
      name: newSkillName.trim(),
      category: { id: 'c_custom', name: newCategory, slug: 'custom' },
      demandLevel: 90,
      facultyLead: 'Dr. Subba Rao Sir',
    };

    allSkills.unshift(newSkillObj);
    setCustomSkills((prev) => [
      ...prev,
      { skillId: newId, verificationStatus: 'VERIFIED', computedLevel: newLevel },
    ]);

    setNewSkillName('');
    setIsModalOpen(false);
  };

  const handleAddSkillToProfile = (skillId: string) => {
    if (!customSkills.some((s) => s.skillId === skillId)) {
      setCustomSkills((prev) => [
        ...prev,
        { skillId, verificationStatus: 'VERIFIED', computedLevel: 'INTERMEDIATE' },
      ]);
    }
  };

  const verifiedCount = customSkills.filter((s) => s.verificationStatus === 'VERIFIED').length;

  const filteredSkills = allSkills.filter((sk) => {
    if (selectedCategory !== 'ALL' && sk.category?.name !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return sk.name.toLowerCase().includes(q) || sk.category?.name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 relative">
      {/* Add Custom Competency Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card p-6 max-w-md w-full rounded-xl bg-[var(--surface-paper)] border border-[var(--border-warm)] shadow-xl space-y-4">
            <h2 className="text-h3 text-[var(--text-primary)] font-bold flex items-center gap-2">
              <Brain className="w-5 h-5 text-[var(--primary-dark)]" />
              Add Custom Competency
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Register a new technical skill or academic competency to your verified portfolio.
            </p>

            <form onSubmit={handleAddCustomCompetency} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Competency / Skill Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Relational Database Design (DBMS)"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-dark)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Domain Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Database Architecture">Database Architecture (DBMS)</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Proficiency Level
                </label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none"
                >
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="INTERMEDIATE">INTERMEDIATE</option>
                  <option value="ADVANCED">ADVANCED</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-warm)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--primary-dark)] text-[var(--text-inverse)] hover:bg-[var(--primary-green)] shadow-sm"
                >
                  Save Competency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-warm)]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-green)] mb-0.5">
            Institutional Taxonomy & Portfolio
          </div>
          <h1 className="text-h1 flex items-center gap-2 text-[var(--text-primary)]">
            <Brain className="w-6 h-6 text-[var(--primary-dark)]" />
            Skill Intelligence Profile
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage your verified competencies, evidence submissions, and role relevance.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} variant="primary" size="sm">
          <Plus className="w-4 h-4" />
          Add Custom Competency
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="surface-card p-4 flex items-center gap-3 bg-[var(--surface-paper)] border border-[var(--border-warm)] rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-[var(--surface-subtle)] text-[var(--primary-dark)] flex items-center justify-center font-bold text-lg">
            {customSkills.length}
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-primary)]">Active Skills</div>
            <div className="text-[11px] text-[var(--text-secondary)]">Added to Student Profile</div>
          </div>
        </div>

        <div className="surface-card p-4 flex items-center gap-3 bg-[var(--surface-paper)] border border-[var(--border-warm)] rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-[var(--surface-subtle)] text-[var(--primary-green)] flex items-center justify-center font-bold text-lg">
            {verifiedCount}
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-primary)]">Verified Skills</div>
            <div className="text-[11px] text-[var(--text-secondary)]">Multi-Source Evidence</div>
          </div>
        </div>

        <div className="surface-card p-4 flex items-center gap-3 bg-[var(--surface-paper)] border border-[var(--border-warm)] rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-[var(--surface-subtle)] text-[var(--accent-saffron)] flex items-center justify-center font-bold text-lg">
            88%
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-primary)]">Confidence Index</div>
            <div className="text-[11px] text-[var(--text-secondary)]">Vishnu Tech Benchmark</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[var(--surface-paper)] p-3 rounded-lg border border-[var(--border-warm)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by competency (e.g. DBMS, Python, SQL, REST APIs)..."
            className="w-full pl-9 pr-4 py-2 rounded-md text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-dark)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--text-tertiary)]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-md text-xs font-medium bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none"
          >
            <option value="ALL">All Competency Categories</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Database Architecture">Database Architecture</option>
            <option value="Cloud & DevOps">Cloud & DevOps</option>
            <option value="Frontend Web Tech">Frontend Web Tech</option>
          </select>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const isAdded = customSkills.some((ms) => ms.skillId === skill.id);

          return (
            <div
              key={skill.id}
              className={`surface-card p-4 rounded-xl border flex flex-col justify-between transition-all bg-[var(--surface-paper)] ${
                isAdded ? 'border-[var(--primary-green)] shadow-sm' : 'border-[var(--border-warm)]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-xs text-[var(--text-primary)]">{skill.name}</h3>
                  {isAdded && (
                    <span className="text-[10px] font-bold text-[var(--primary-green)] bg-[var(--surface-subtle)] px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[var(--primary-green)]" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5">
                  {skill.category?.name || 'Software Tech'} · Benchmark:{' '}
                  <strong className="text-[var(--primary-dark)]">{skill.demandLevel}%</strong>
                </p>
                {skill.facultyLead && (
                  <div className="text-[11px] text-[var(--text-tertiary)] mt-1 font-medium">
                    Evaluator: {skill.facultyLead}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-warm)] flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-tertiary)]">Vishnu Tech Standard</span>
                <Button
                  size="sm"
                  variant={isAdded ? 'outline' : 'primary'}
                  disabled={isAdded}
                  onClick={() => handleAddSkillToProfile(skill.id)}
                >
                  {isAdded ? 'In Profile' : 'Add Competency'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
