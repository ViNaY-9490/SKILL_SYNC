'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Award,
  Zap,
  Target,
  ChevronRight,
  PlayCircle,
  BarChart3,
} from 'lucide-react';

interface LearningModule {
  id: string;
  title: string;
  provider: string;
  skill: string;
  duration: string;
  type: 'COURSE' | 'PROJECT' | 'DOCUMENTATION';
  url?: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  progress: number;
}

interface LearningMilestone {
  id: string;
  phase: string;
  title: string;
  description: string;
  targetDate: string;
  isCompleted: boolean;
  modules: LearningModule[];
}

const INITIAL_MILESTONES: LearningMilestone[] = [
  {
    id: 'm1',
    phase: 'Phase 1',
    title: 'Containerization & Cloud Infrastructure',
    description: 'Master Docker fundamentals and basic AWS services to close your highest-severity backend skill gap.',
    targetDate: '2 Weeks Left',
    isCompleted: false,
    modules: [
      {
        id: 'mod_1',
        title: 'Docker for Backend Engineers (Hands-On)',
        provider: 'SkillSync Learning / Coursera',
        skill: 'Docker',
        duration: '6 hours',
        type: 'COURSE',
        url: 'https://coursera.org/search?query=docker',
        status: 'IN_PROGRESS',
        progress: 60,
      },
      {
        id: 'mod_2',
        title: 'Containerize InventoryFlow REST API',
        provider: 'Self-Guided Project',
        skill: 'Docker Compose',
        duration: '4 hours',
        type: 'PROJECT',
        status: 'IN_PROGRESS',
        progress: 40,
      },
      {
        id: 'mod_3',
        title: 'AWS Cloud Practitioner Essentials',
        provider: 'AWS Training',
        skill: 'AWS',
        duration: '5 hours',
        type: 'COURSE',
        url: 'https://aws.amazon.com/training/',
        status: 'NOT_STARTED',
        progress: 0,
      },
    ],
  },
  {
    id: 'm2',
    phase: 'Phase 2',
    title: 'Advanced System Design & Microservices',
    description: 'Understand caching strategies, message queues, and API gateway security for scalable backend systems.',
    targetDate: '4 Weeks Out',
    isCompleted: false,
    modules: [
      {
        id: 'mod_4',
        title: 'Redis Caching & Session Management in Python',
        provider: 'SkillSync Academy',
        skill: 'Redis',
        duration: '3 hours',
        type: 'COURSE',
        status: 'COMPLETED',
        progress: 100,
      },
      {
        id: 'mod_5',
        title: 'System Design Interview Guide for Junior Developers',
        provider: 'ByteByteGo / GitHub',
        skill: 'System Design',
        duration: '8 hours',
        type: 'DOCUMENTATION',
        status: 'NOT_STARTED',
        progress: 0,
      },
    ],
  },
  {
    id: 'm3',
    phase: 'Phase 3',
    title: 'Mock Interview Prep & Placement Readiness',
    description: 'Complete 3 technical mock interviews and achieve 85+ Placement Readiness score.',
    targetDate: '6 Weeks Out',
    isCompleted: false,
    modules: [
      {
        id: 'mod_6',
        title: 'Python Backend Algorithm & Data Structure Drills',
        provider: 'LeetCode / SkillSync',
        skill: 'Algorithms',
        duration: '10 hours',
        type: 'COURSE',
        status: 'NOT_STARTED',
        progress: 0,
      },
    ],
  },
];

export default function LearningPlanPage() {
  const [milestones, setMilestones] = useState<LearningMilestone[]>(INITIAL_MILESTONES);
  const [streakDays, setStreakDays] = useState(12);

  const toggleModuleStatus = (milestoneId: string, moduleId: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== milestoneId) return m;
        const updatedModules = m.modules.map((mod) => {
          if (mod.id !== moduleId) return mod;
          const nextStatus: 'COMPLETED' | 'IN_PROGRESS' = mod.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
          return { ...mod, status: nextStatus, progress: nextStatus === 'COMPLETED' ? 100 : 50 };
        });
        const allDone = updatedModules.every((mod) => mod.status === 'COMPLETED');
        return { ...m, modules: updatedModules, isCompleted: allDone };
      }),
    );
  };

  const totalModules = milestones.flatMap((m) => m.modules).length;
  const completedModules = milestones.flatMap((m) => m.modules).filter((mod) => mod.status === 'COMPLETED').length;
  const overallProgress = Math.round((completedModules / totalModules) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <BookOpen className="w-6 h-6 text-indigo-600" />
            AI Personalized Learning Roadmap
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Tailored learning path designed by AI to close your skill gaps for <strong>Backend Developer</strong>.
          </p>
        </div>

        {/* Streak & Score Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 font-bold text-xs">
            <Flame className="w-4 h-4 fill-amber-500" />
            {streakDays} Day Learning Streak!
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm">
            <Zap className="w-3.5 h-3.5" /> Recalculate Roadmap
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>OVERALL ROADMAP PROGRESS</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{overallProgress}%</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${overallProgress}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-2">{completedModules} of {totalModules} modules completed</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>WEEKLY TIME SPENT</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">7.5 Hours</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">Target: 10 hrs/week (+2.5 hrs remaining)</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>NEXT MILESTONE GOAL</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
            Phase 1: Containerization
          </div>
          <p className="text-xs text-slate-500 mt-1">Target completion: in 14 days</p>
        </div>
      </div>

      {/* Milestones Stack */}
      <div className="space-y-6">
        {milestones.map((milestone, mIdx) => (
          <div
            key={milestone.id}
            className={`card p-6 border-l-4 transition-all ${
              milestone.isCompleted ? 'border-emerald-500' : 'border-indigo-600'
            }`}
          >
            {/* Milestone Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    {milestone.phase}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {milestone.title}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">{milestone.description}</p>
              </div>

              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {milestone.targetDate}
              </span>
            </div>

            {/* Modules List */}
            <div className="space-y-3">
              {milestone.modules.map((mod) => (
                <div
                  key={mod.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleModuleStatus(milestone.id, mod.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        mod.status === 'COMPLETED'
                          ? 'bg-emerald-600 text-white'
                          : 'border border-slate-300 dark:border-slate-600 hover:border-indigo-600'
                      }`}
                      title="Toggle completion status"
                    >
                      {mod.status === 'COMPLETED' && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-bold text-sm text-slate-900 dark:text-white ${
                            mod.status === 'COMPLETED' ? 'line-through text-slate-400 dark:text-slate-500' : ''
                          }`}
                        >
                          {mod.title}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {mod.skill}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {mod.provider} • {mod.duration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {mod.url && (
                      <a
                        href={mod.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Start <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        mod.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : mod.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {mod.status === 'COMPLETED' ? 'Completed ✓' : mod.status === 'IN_PROGRESS' ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
