'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, AlertCircle, ArrowUpRight, BookOpen, Briefcase, Award, Sparkles } from 'lucide-react';

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  status: 'STRONG' | 'DEVELOPING' | 'NEEDS_ATTENTION';
  evidenceCount: number;
  relevance: string;
  recommendedAction: string;
  relatedOpportunitiesCount: number;
}

interface SkillMapProps {
  targetRole?: string;
  readinessScore?: number;
  skills?: SkillNode[];
  onSkillSelect?: (skill: SkillNode) => void;
}

const DEFAULT_SKILLS: SkillNode[] = [
  {
    id: 's1',
    name: 'Python & Data Structures',
    category: 'Software Engineering',
    status: 'STRONG',
    evidenceCount: 2,
    relevance: 'Direct requirement for Full-Stack Software Engineer positions.',
    recommendedAction: 'Evidence verified by faculty.',
    relatedOpportunitiesCount: 4,
  },
  {
    id: 's2',
    name: 'SQL & Database Design',
    category: 'Database Architecture',
    status: 'STRONG',
    evidenceCount: 3,
    relevance: 'Essential for relational queries, JOINs, indexing and ACID transactions under Dr. Subba Rao Sir.',
    recommendedAction: 'Maintain level with DBMS lab verification.',
    relatedOpportunitiesCount: 5,
  },
  {
    id: 's3',
    name: 'REST API Architecture & NestJS',
    category: 'Software Engineering',
    status: 'STRONG',
    evidenceCount: 2,
    relevance: 'Evaluates HTTP status codes, API versioning, and JWT authentication.',
    recommendedAction: 'Verified via project submission.',
    relatedOpportunitiesCount: 3,
  },
  {
    id: 's4',
    name: 'Docker & Containerization',
    category: 'Cloud & DevOps',
    status: 'DEVELOPING',
    evidenceCount: 1,
    relevance: 'Containerizing microservices and managing multi-container deployments.',
    recommendedAction: 'Complete Docker & Kubernetes hands-on module.',
    relatedOpportunitiesCount: 2,
  },
];

export function SkillMap({
  targetRole = 'Full-Stack Software Engineer',
  readinessScore = 84,
  skills = DEFAULT_SKILLS,
  onSkillSelect,
}: SkillMapProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode>(skills[0] || DEFAULT_SKILLS[0]);

  const getStatusColor = (status: SkillNode['status']) => {
    switch (status) {
      case 'STRONG':
        return { bg: 'var(--surface-subtle)', text: 'var(--primary-green)', badgeBg: 'var(--primary-dark)', border: 'var(--border-warm)' };
      case 'DEVELOPING':
        return { bg: 'var(--surface-subtle)', text: 'var(--accent-saffron)', badgeBg: 'var(--accent-saffron)', border: 'var(--border-warm)' };
      case 'NEEDS_ATTENTION':
        return { bg: 'var(--surface-subtle)', text: 'var(--accent-terracotta)', badgeBg: 'var(--accent-terracotta)', border: 'var(--border-warm)' };
    }
  };

  const handleSelect = (skill: SkillNode) => {
    setSelectedSkill(skill);
    if (onSkillSelect) onSkillSelect(skill);
  };

  return (
    <div className="rounded-xl border border-[var(--border-warm)] bg-[var(--surface-paper)] p-6 shadow-sm transition-all">
      {/* Header & Target Role Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[var(--border-warm)] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
            <Target className="w-4 h-4 text-[var(--accent-saffron)]" />
            Career Progression Pathway
          </div>
          <h2 className="text-h1 text-[var(--text-primary)]">{targetRole}</h2>
        </div>

        <div className="flex items-center gap-4 bg-[var(--surface-bg)] px-4 py-3 rounded-lg border border-[var(--border-warm)]">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-[var(--text-secondary)]">Role Alignment</div>
            <div className="text-xs text-[var(--text-tertiary)]">
              {skills.filter((s) => s.status === 'STRONG').length} of {skills.length} core skills verified
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-[var(--primary-green)] flex items-center justify-center font-bold text-sm text-[var(--primary-dark)]">
            {readinessScore}%
          </div>
        </div>
      </div>

      {/* Connected Pathway / Skill Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Skill Nodes */}
        <div className="lg:col-span-6 space-y-3">
          <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
            Required Competencies ({skills.length})
          </div>

          {skills.map((skill, index) => {
            const isSelected = selectedSkill?.id === skill.id;
            const colors = getStatusColor(skill.status);

            return (
              <motion.div
                key={skill.id}
                onClick={() => handleSelect(skill)}
                whileHover={{ scale: 1.01, x: 2 }}
                transition={{ duration: 0.15 }}
                className={`cursor-pointer p-4 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-[var(--primary-green)] bg-[var(--surface-bg)] shadow-sm ring-1 ring-[var(--primary-green)]'
                    : 'border-[var(--border-warm)] bg-[var(--surface-card)] hover:border-[var(--primary-green)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-2 h-10 rounded-full flex-shrink-0 mt-0.5"
                      style={{ background: colors.badgeBg }}
                    />
                    <div>
                      <h4 className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
                        {skill.name}
                        {skill.status === 'STRONG' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-green)]" />
                        )}
                      </h4>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">{skill.category}</div>
                    </div>
                  </div>

                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded text-[var(--text-inverse)]"
                    style={{ background: colors.badgeBg }}
                  >
                    {skill.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Evidence & Opportunities mini chips */}
                <div className="flex items-center gap-3 mt-3 pt-2 border-t border-[var(--border-warm)] text-xs text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[var(--primary-green)]" />
                    {skill.evidenceCount} Verified Evidence
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-[var(--accent-saffron)]" />
                    {skill.relatedOpportunitiesCount} Matching Roles
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Deep-Dive Skill Intelligence Panel */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {selectedSkill ? (
              <motion.div
                key={selectedSkill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-[var(--surface-card)] border border-[var(--border-warm)] rounded-xl p-5 shadow-sm h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--border-warm)]">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                        Skill Intelligence Detail
                      </span>
                      <h3 className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
                        {selectedSkill.name}
                      </h3>
                    </div>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded"
                      style={{
                        background: getStatusColor(selectedSkill.status).bg,
                        color: getStatusColor(selectedSkill.status).text,
                      }}
                    >
                      {selectedSkill.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Why this skill matters */}
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-[var(--text-secondary)] mb-1">
                        Role Relevance & Impact
                      </div>
                      <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--surface-bg)] p-3 rounded-lg border border-[var(--border-warm)]">
                        {selectedSkill.relevance}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--accent-saffron)]" />
                        Recommended Next Action
                      </div>
                      <p className="text-xs font-medium text-[var(--text-primary)] bg-[var(--surface-subtle)] p-3 rounded-lg border border-[var(--border-warm)]">
                        {selectedSkill.recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-[var(--border-warm)] flex items-center justify-between gap-3">
                  <div className="text-xs text-[var(--text-secondary)]">
                    {selectedSkill.relatedOpportunitiesCount} active industry placements match this skill
                  </div>
                  <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-[var(--text-inverse)] bg-[var(--primary-dark)] hover:bg-[var(--primary-green)] transition-colors cursor-pointer shadow-sm">
                    Explore Opportunities
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
