'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  Brain,
  Building2,
  GraduationCap,
  Sparkles,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

const SAMPLE_TRENDING_SKILLS = [
  { name: 'Clinical Research Methods', demand: 95, category: 'Research & Trials' },
  { name: 'Ayush Pharmacovigilance', demand: 92, category: 'Regulatory Safety' },
  { name: 'Herbal Drug Standardization', demand: 90, category: 'Pharmacology' },
  { name: 'Biostatistics & R', demand: 94, category: 'Data & Analytics' },
  { name: 'Scientific Paper Writing', demand: 88, category: 'Academic Writing' },
  { name: 'Clinical Trial Design', demand: 91, category: 'Trials & Protocols' },
];

const SAMPLE_INSTITUTIONS = [
  { name: 'All India Institute of Ayurveda (AIIA)', city: 'New Delhi', type: 'Apex Institute', students: '2,500+' },
  { name: 'National Institute of Ayurveda (NIA)', city: 'Jaipur', type: 'Deemed University', students: '1,800+' },
  { name: 'Institute of Teaching & Research in Ayurveda', city: 'Jamnagar', type: 'INI', students: '2,100+' },
  { name: 'BHU Faculty of Ayurveda', city: 'Varanasi', type: 'Central University', students: '3,200+' },
];

const SAMPLE_ORGANIZATIONS = [
  { name: 'Himalaya Wellness Company', industry: 'Ayurvedic Pharmaceuticals', size: 'Enterprise' },
  { name: 'Dabur Research Foundation', industry: 'R&D & Natural Care', size: 'Enterprise' },
  { name: 'Baidyanath Research Wing', industry: 'Traditional Medicine R&D', size: 'SME' },
  { name: 'Aster Labs Ayush Division', industry: 'Clinical Diagnostics', size: 'Corporate' },
];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'skills' | 'institutions' | 'organizations'>('skills');

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
              <Link href="/explore" className="text-[var(--primary-dark)] font-bold">Explore Taxonomy</Link>
              <Link href="/about" className="hover:text-[var(--primary-dark)] transition-colors">About Portal</Link>
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
      <section className="py-14 max-w-7xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[var(--surface-subtle)] text-[var(--primary-dark)] border border-[var(--border-warm)] mb-4">
          <Shield className="w-3.5 h-3.5 text-[var(--primary-green)]" /> Standardized Competency Ecosystem
        </div>

        <h1 className="text-display font-bold mb-3">Explore Skills, Academia & Industry</h1>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-xs sm:text-sm mb-8 leading-relaxed">
          Browse standardized Ayush competency taxonomies, verified partner institutions, and participating healthcare organizations.
        </p>

        {/* Search */}
        <div className="relative max-w-lg mx-auto mb-8">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search competencies, institutions, or hiring organizations..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--surface-paper)] border border-[var(--border-warm)] text-xs text-[var(--text-primary)] outline-none focus:border-[var(--primary-dark)] transition-colors shadow-xs"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2">
          {[
            { id: 'skills', label: 'Competency Taxonomy', icon: Brain },
            { id: 'institutions', label: 'Partner Institutions', icon: GraduationCap },
            { id: 'organizations', label: 'Industry Partners', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[var(--primary-dark)] text-[var(--text-inverse)] shadow-xs'
                    : 'bg-[var(--surface-paper)] text-[var(--text-secondary)] border border-[var(--border-warm)] hover:bg-[var(--surface-subtle)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid Results */}
      <section className="py-6 max-w-7xl mx-auto px-4 pb-20">
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SAMPLE_TRENDING_SKILLS.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map((skill) => (
              <div key={skill.name} className="surface-card p-5 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-[var(--primary-green)] mb-1">{skill.category}</div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)] mb-2">{skill.name}</h3>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-tertiary)]">Industry Demand Score</span>
                  <span className="text-xs font-extrabold text-[var(--primary-dark)] bg-[var(--surface-subtle)] px-2 py-0.5 rounded">
                    {skill.demand}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'institutions' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {SAMPLE_INSTITUTIONS.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map((inst) => (
              <div key={inst.name} className="surface-card p-5">
                <div className="w-9 h-9 rounded-lg bg-[var(--surface-subtle)] text-[var(--primary-dark)] flex items-center justify-center font-bold mb-3">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">{inst.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] mb-3">{inst.city} • {inst.type}</p>
                <div className="text-[10px] font-bold text-[var(--primary-dark)] bg-[var(--surface-subtle)] px-2 py-1 rounded w-fit">
                  {inst.students} Students Enrolled
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'organizations' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {SAMPLE_ORGANIZATIONS.filter(o => o.name.toLowerCase().includes(search.toLowerCase())).map((org) => (
              <div key={org.name} className="surface-card p-5">
                <div className="w-9 h-9 rounded-lg bg-[var(--surface-subtle)] text-[var(--primary-green)] flex items-center justify-center font-bold mb-3">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">{org.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] mb-3">{org.industry}</p>
                <div className="text-[10px] font-bold text-[var(--primary-green)] bg-[var(--surface-subtle)] px-2 py-1 rounded w-fit">
                  {org.size}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
