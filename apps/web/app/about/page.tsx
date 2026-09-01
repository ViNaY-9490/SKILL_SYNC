'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Brain,
  Sparkles,
  Target,
  Users,
  Building2,
  GraduationCap,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

const PILLARS = [
  {
    step: '01',
    title: 'Competency Mapping Engine',
    desc: 'Multi-source skill extraction, taxonomy mapping, and self/verified confidence scoring.',
    icon: Brain,
  },
  {
    step: '02',
    title: 'Explainable Matching',
    desc: 'Hybrid matching algorithm calculating skill compatibility, proficiency gap, and career goal alignment.',
    icon: Target,
  },
  {
    step: '03',
    title: 'Academic-Industry Bridge',
    desc: 'Direct connection between university talent pools and corporate hiring managers.',
    icon: Building2,
  },
  {
    step: '04',
    title: 'AI Career Copilot',
    desc: 'Instant guidance for skill roadmaps, evidence review, and interview prep.',
    icon: Zap,
  },
];

const STAKEHOLDERS = [
  {
    role: 'Students & Scholars',
    icon: GraduationCap,
    benefits: [
      'Personalized skill gap roadmaps',
      'AI match scores for opportunities',
      'Verified digital skill portfolio',
      'Career Copilot guidance',
    ],
  },
  {
    role: 'Industry & Recruiters',
    icon: Building2,
    benefits: [
      'Skill-verified candidate discovery',
      'Reduced time-to-hire with precision matching',
      'Publish internships, jobs & live projects',
      'Direct academia mentorship pipeline',
    ],
  },
  {
    role: 'Faculty',
    icon: Users,
    benefits: [
      'Industry research collaboration',
      'Student mentorship matching',
      'Faculty development programs (FDP)',
      'Consultancy project portal',
    ],
  },
  {
    role: 'Institutions & T&P',
    icon: ShieldCheck,
    benefits: [
      'Batch-level skill heatmaps',
      'Placement readiness distribution',
      'Recruitment outcome tracking',
      'Curriculum gap analytics',
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-bg)] text-[var(--text-primary)] transition-colors">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[var(--surface-paper)]/90 backdrop-blur-md border-b border-[var(--border-warm)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary-dark)] text-[var(--text-inverse)] font-bold text-sm flex items-center justify-center shadow-xs">
                SS
              </div>
              <div>
                <span className="font-bold text-base text-[var(--text-primary)] block">SkillSync</span>
                <span className="text-[9px] uppercase font-bold text-[var(--text-tertiary)]">Vishnu Institute of Technology</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-[var(--text-secondary)]">
              <Link href="/" className="hover:text-[var(--primary-dark)] transition-colors">Home</Link>
              <Link href="/explore" className="hover:text-[var(--primary-dark)] transition-colors">Explore</Link>
              <Link href="/about" className="text-[var(--primary-dark)] font-bold">About Portal</Link>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[var(--surface-subtle)] text-[var(--primary-dark)] border border-[var(--border-warm)] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-saffron)]" /> Institutional Skill Intelligence
        </div>

        <h1 className="text-display font-bold tracking-tight mb-4">
          Connecting Skills to Opportunity Through Intelligence
        </h1>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
          SkillSync is an AI-powered academia–industry intelligence ecosystem designed to bridge the gap between higher education skills and modern industry demand for Vishnu Institute of Technology, Bhimavaram.
        </p>
      </section>

      {/* Core Value Proposition Flow */}
      <section className="py-12 bg-[var(--surface-paper)] border-y border-[var(--border-warm)]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-6">
            Core Institutional Value Proposition
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-extrabold text-[var(--text-primary)]">
            <span className="px-3.5 py-1.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-warm)]">Skills</span>
            <span>→</span>
            <span className="px-3.5 py-1.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-warm)]">Intelligence</span>
            <span>→</span>
            <span className="px-3.5 py-1.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-warm)]">Growth</span>
            <span>→</span>
            <span className="px-3.5 py-1.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-warm)]">Opportunity</span>
            <span>→</span>
            <span className="px-3.5 py-1.5 rounded-lg bg-[var(--primary-dark)] text-[var(--text-inverse)]">Placement Outcome</span>
          </div>
        </div>
      </section>

      {/* 4 Pillars Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-h1 font-bold mb-2">Architectural Pillars</h2>
          <p className="text-xs text-[var(--text-secondary)]">Built for precision, scalability, and transparent decision-making.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.step} className="surface-card p-5 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-[var(--text-tertiary)] mb-2">{pillar.step}</div>
                  <div className="w-8 h-8 rounded-lg bg-[var(--surface-subtle)] text-[var(--primary-dark)] flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-xs text-[var(--text-primary)] mb-1">{pillar.title}</h3>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stakeholders Section */}
      <section className="py-16 bg-[var(--surface-paper)] border-t border-[var(--border-warm)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-h1 font-bold mb-2">Empowering Primary Stakeholders</h2>
            <p className="text-xs text-[var(--text-secondary)]">Tailored experiences for each ecosystem participant.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STAKEHOLDERS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.role} className="surface-card p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-subtle)] text-[var(--primary-dark)] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">{item.role}</h3>
                  </div>

                  <ul className="space-y-1.5">
                    {item.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-green)] flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border-warm)] text-center text-xs text-[var(--text-tertiary)]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--primary-dark)] text-[var(--text-inverse)] font-bold text-xs flex items-center justify-center">
              SS
            </div>
            <span className="font-bold text-[var(--text-primary)]">SkillSync</span>
            <span>— Vishnu Institute of Technology, Bhimavaram</span>
          </div>

          <div>© 2026 SkillSync Platform. Vishnu Institute of Technology, Bhimavaram.</div>
        </div>
      </footer>
    </div>
  );
}
