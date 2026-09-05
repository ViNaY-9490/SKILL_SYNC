'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Plus,
  Sparkles,
  Users,
  X,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { useOpportunitiesStore } from '@/store/opportunities.store';

const SUGGESTED_SKILLS = [
  'Python',
  'SQL',
  'REST API',
  'React',
  'TypeScript',
  'Node.js',
  'FastAPI',
  'Docker',
  'AWS',
  'Machine Learning',
  'DevOps',
];

export default function NewOpportunityPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    companyName: 'Apex Cloud Systems & Engineering',
    type: 'INTERNSHIP',
    workMode: 'HYBRID',
    location: 'Bengaluru, Karnataka / Remote',
    duration: '3 months',
    stipend: '₹25,000 / month',
    salary: '',
    openings: 3,
    applicationDeadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    description: '',
  });

  const [skills, setSkills] = useState<string[]>(['Python', 'SQL', 'REST API']);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const { addOpportunity } = useOpportunitiesStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);

    // Save to persistent opportunities store for immediate cross-portal availability
    addOpportunity({
      title: formData.title,
      description: formData.description || 'Full stack development role featuring hands-on platform engineering.',
      type: formData.type as any,
      workMode: formData.workMode as any,
      location: formData.location,
      duration: formData.duration,
      stipend: formData.stipend,
      salary: formData.salary,
      openings: Number(formData.openings) || 1,
      applicationDeadline: formData.applicationDeadline,
      organization: {
        id: `org_${Date.now()}`,
        name: formData.companyName || 'Apex Cloud Systems & Engineering',
        industry: 'Software & Technology Solutions',
      },
      skills: skills.map((s, idx) => ({
        skill: { id: `sk_${idx}`, name: s },
        isRequired: true,
        requiredLevel: 'INTERMEDIATE',
      })),
    });

    try {
      await api.post('/opportunities', {
        ...formData,
        skills,
        openings: Number(formData.openings) || 1,
      });
    } catch (err) {
      console.warn('API opportunity creation warning (demo mode fallback active):', err);
    } finally {
      queryClient.invalidateQueries({ queryKey: ['industry-opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      setSuccessToast(true);
      setTimeout(() => {
        router.push('/dashboard/industry/opportunities');
      }, 1200);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-5 right-5 z-50 bg-emerald-950 text-emerald-100 border border-emerald-500 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs font-bold">Opportunity Published!</p>
              <p className="text-[11px] opacity-80">Redirecting to management dashboard...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <Link
          href="/dashboard/industry/opportunities"
          className="p-2 rounded-xl border transition-all hover:opacity-80"
          style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Recruiter Portal
          </span>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Publish New Opportunity
          </h1>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Info */}
        <div className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Briefcase className="w-4 h-4 text-emerald-400" /> Basic Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Opportunity Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Backend Development Intern or Full Stack Software Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all focus:border-emerald-500"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Company / Organization Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Opportunity Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none font-medium"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              >
                <option value="INTERNSHIP">Internship</option>
                <option value="JOB">Full-Time Placement</option>
                <option value="LIVE_PROJECT">Live Industry Project</option>
                <option value="APPRENTICESHIP">Apprenticeship</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Logistics */}
        <div className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <MapPin className="w-4 h-4 text-emerald-400" /> Work Mode & Logistics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Work Mode *
              </label>
              <select
                value={formData.workMode}
                onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none font-medium"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              >
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
                <option value="ONSITE">Onsite</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Hyderabad / Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 3 months or Full-time"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Compensation / Stipend
              </label>
              <input
                type="text"
                placeholder="e.g. ₹25,000 / mo or ₹12 LPA"
                value={formData.stipend}
                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Openings Count
              </label>
              <input
                type="number"
                min="1"
                value={formData.openings}
                onChange={(e) => setFormData({ ...formData, openings: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Application Deadline
              </label>
              <input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Skill Graph Competencies */}
        <div className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Sparkles className="w-4 h-4 text-emerald-400" /> Competency & Skill Tags
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Selected skills are used by the AI engine to match candidates based on verified student profiles.
          </p>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-red-400 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type skill name & press Enter..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(skillInput);
                }
              }}
              className="flex-1 px-3.5 py-2 rounded-xl text-sm border outline-none"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            />
            <button
              type="button"
              onClick={() => handleAddSkill(skillInput)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all"
            >
              Add Skill
            </button>
          </div>

          <div>
            <span className="text-[11px] font-semibold block mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  className="px-2.5 py-1 rounded-lg text-xs border transition-all hover:bg-emerald-500/10 hover:border-emerald-500/40"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Description */}
        <div className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            Role Description & Qualifications
          </h2>
          <textarea
            rows={5}
            required
            placeholder="Describe key responsibilities, deliverables, required qualifications, and learning outcomes..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none resize-none"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/dashboard/industry/opportunities"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {isSubmitting ? 'Publishing Opportunity...' : 'Publish Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
}
