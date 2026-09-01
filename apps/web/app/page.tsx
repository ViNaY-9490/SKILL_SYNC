'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  TrendingUp,
  Users,
  Building2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Target,
  Shield,
  Award,
  BookOpen,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const JOURNEY_STEPS = [
  { icon: Target, step: '01', title: 'Competency Mapping', desc: 'Define skill requirements for target roles' },
  { icon: Brain, step: '02', title: 'Multi-Source Assessment', desc: 'Verify skills from projects & coursework' },
  { icon: BarChart3, step: '03', title: 'Gap Intelligence', desc: 'Identify precise skill gaps with AI' },
  { icon: BookOpen, step: '04', title: 'Targeted Growth', desc: 'Institutional learning & mentor pathways' },
  { icon: Building2, step: '05', title: 'Industry Match', desc: 'Direct placement & internship discovery' },
];

const STATS = [
  { value: '50+', label: 'Competencies Mapped', sub: 'Standardized Engineering taxonomy' },
  { value: '82%', label: 'Average Skill Match', sub: 'Precision skill alignment' },
  { value: '15+', label: 'Industry & Institution Partners', sub: 'Campus & Industry network' },
  { value: '100%', label: 'Verified Evidence', sub: 'Institutional verification' },
];

const STAKEHOLDERS = [
  {
    role: 'STUDENT',
    title: 'Students & Scholars',
    badge: 'Skill Mapping',
    desc: 'Understand exact industry expectations, uncover skill gaps, build verified capability portfolios, and land top opportunities.',
    highlights: [
      'Interactive skill gap heatmap',
      'Personalized learning roadmaps',
      'Verified capability portfolio',
      'Direct opportunity matching with match %',
    ],
    cta: '/register?role=STUDENT',
    ctaLabel: 'Map Your Skills',
  },
  {
    role: 'INDUSTRY',
    title: 'Industry Partners',
    badge: 'Talent Pipeline',
    desc: 'Access verified talent, publish skill-matched internships and jobs, and collaborate on institutional R&D.',
    highlights: [
      'Publish internships & competency requirements',
      'Skill-based candidate search & discovery',
      'Verified credential & evidence validation',
      'Institutional joint research & mentorship',
    ],
    cta: '/register?role=INDUSTRY',
    ctaLabel: 'Discover Talent',
  },
  {
    role: 'ACADEMIA',
    title: 'Faculty & Institutions',
    badge: 'Curriculum Alignment',
    desc: 'Align academic programs with industry demand, track student readiness, and drive recruitment outcomes.',
    highlights: [
      'Batch-level skill intelligence & heatmaps',
      'Placement readiness tracking',
      'Industry demand trend insights',
      'Curriculum gap correlation analysis',
    ],
    cta: '/register?role=INSTITUTION_ADMIN',
    ctaLabel: 'Align Curriculum',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-bg)] text-[var(--text-primary)] transition-colors">
      {/* =========== HEADER / NAVIGATION =========== */}
      <header className="sticky top-0 z-50 bg-[var(--surface-paper)]/90 backdrop-blur-md border-b border-[var(--border-warm)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary-dark)] text-[var(--text-inverse)] font-bold text-sm flex items-center justify-center shadow-sm">
                SS
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-[var(--text-primary)] block">
                  SkillSync
                </span>
                <span className="text-[9px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider block">
                  Vishnu Institute of Technology, Bhimavaram
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[var(--text-secondary)]">
              <Link href="#platform" className="hover:text-[var(--primary-dark)] transition-colors">
                Platform
              </Link>
              <Link href="#skills" className="hover:text-[var(--primary-dark)] transition-colors">
                Skill Mapping
              </Link>
              <Link href="#opportunities" className="hover:text-[var(--primary-dark)] transition-colors">
                Opportunities
              </Link>
              <Link href="#stakeholders" className="hover:text-[var(--primary-dark)] transition-colors">
                Institutions & Industry
              </Link>
              <Link href="#how-it-works" className="hover:text-[var(--primary-dark)] transition-colors">
                How It Works
              </Link>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login" className="text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--primary-dark)] transition-colors hidden sm:block">
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-[var(--primary-dark)] text-[var(--text-inverse)] text-xs font-semibold hover:bg-[var(--primary-green)] transition-all shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* =========== HERO SECTION =========== */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-[var(--surface-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Institution Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-subtle)] border border-[var(--border-warm)] text-[var(--primary-dark)] text-xs font-semibold mb-6">
              <Shield className="w-3.5 h-3.5 text-[var(--primary-green)]" />
              Institutional Skill Intelligence · Vishnu Institute of Technology, Bhimavaram
            </div>

            {/* Headline */}
            <h1 className="text-display max-w-4xl mx-auto mb-6 text-[var(--text-primary)]">
              Bridging Academia & Industry Through{' '}
              <span className="text-[var(--primary-dark)] underline decoration-[var(--accent-saffron)] decoration-2 underline-offset-4">
                Skill Intelligence
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg max-w-2xl mx-auto text-[var(--text-secondary)] mb-10 leading-relaxed">
              A unified platform connecting students, faculty, and industry partners to map competencies, analyze skill gaps, and accelerate placement outcomes.
            </p>

            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--primary-dark)] text-[var(--text-inverse)] font-semibold text-sm hover:bg-[var(--primary-green)] shadow-sm transition-all"
              >
                Start Skill Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login?demo=true"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--surface-paper)] text-[var(--text-primary)] border border-[var(--border-warm)] font-semibold text-sm hover:bg-[var(--surface-subtle)] transition-all"
              >
                Explore Live Demo
                <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)]" />
              </Link>
            </div>
          </motion.div>

          {/* =========== ACADEMIA → SKILLS → INDUSTRY BRIDGE =========== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 p-6 rounded-2xl bg-[var(--surface-paper)] border border-[var(--border-warm)] shadow-sm max-w-5xl mx-auto"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
              The Connected Institutional Ecosystem
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: 'ACADEMIA', icon: GraduationCap, color: '#173F35', label: 'Curriculum & Education' },
                { title: 'SKILLS', icon: Brain, color: '#256B58', label: 'Taxonomy & Gap Analysis' },
                { title: 'INDUSTRY', icon: Building2, color: '#E38B32', label: 'Requirements & Projects' },
                { title: 'OPPORTUNITY', icon: TrendingUp, color: '#B9674B', label: 'Placement & Internships' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-4 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-subtle)] flex flex-col items-center text-center relative"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--text-inverse)] mb-2 font-bold shadow-xs"
                      style={{ background: item.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[var(--text-primary)]">{item.title}</span>
                    <span className="text-[11px] text-[var(--text-secondary)] mt-0.5">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========== STATS BANNER =========== */}
      <section className="py-12 bg-[var(--surface-paper)] border-b border-[var(--border-warm)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-[var(--primary-dark)]">{stat.value}</div>
                <div className="text-xs font-semibold text-[var(--text-primary)] mt-1">{stat.label}</div>
                <div className="text-[11px] text-[var(--text-tertiary)]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== HOW IT WORKS =========== */}
      <section id="how-it-works" className="py-20 border-b border-[var(--border-warm)] bg-[var(--surface-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-green)]">
              Structured Progression
            </span>
            <h2 className="text-h1 mt-1 text-[var(--text-primary)]">How SkillSync Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {JOURNEY_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="p-5 rounded-xl bg-[var(--surface-paper)] border border-[var(--border-warm)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[var(--text-tertiary)]">{step.step}</span>
                      <Icon className="w-4 h-4 text-[var(--primary-dark)]" />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">{step.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========== STAKEHOLDERS =========== */}
      <section id="stakeholders" className="py-20 bg-[var(--surface-paper)] border-b border-[var(--border-warm)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-saffron)]">
              Ecosystem Roles
            </span>
            <h2 className="text-h1 mt-1 text-[var(--text-primary)]">Tailored for Primary Stakeholders</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {STAKEHOLDERS.map((stakeholder) => (
              <div
                key={stakeholder.role}
                className="surface-card p-6 flex flex-col justify-between bg-[var(--surface-card)] border border-[var(--border-warm)] rounded-xl"
              >
                <div>
                  <div className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold bg-[var(--surface-subtle)] text-[var(--primary-dark)] mb-3">
                    {stakeholder.badge}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{stakeholder.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-6 leading-relaxed">
                    {stakeholder.desc}
                  </p>

                  <ul className="space-y-2 mb-8">
                    {stakeholder.highlights.map((item, idx) => (
                      <li key={idx} className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-green)] flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={stakeholder.cta}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[var(--primary-dark)] text-[var(--text-inverse)] text-xs font-semibold hover:bg-[var(--primary-green)] transition-colors w-full"
                >
                  {stakeholder.ctaLabel}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== FOOTER =========== */}
      <footer className="py-12 bg-[var(--surface-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border-warm)]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[var(--primary-dark)] text-[var(--text-inverse)] text-xs font-bold flex items-center justify-center">
                SS
              </div>
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                SkillSync · Vishnu Institute of Technology, Bhimavaram
              </span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)]">
              © 2026 SkillSync Platform. Vishnu Institute of Technology, Bhimavaram. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
