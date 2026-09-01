'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  GraduationCap,
  Star,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Search,
  Filter,
} from 'lucide-react';

const SAMPLE_MENTORS = [
  {
    id: 'm_subba_rao',
    name: 'Dr. Subba Rao Sir',
    role: 'Professor & Head of DBMS Department',
    type: 'FACULTY',
    organization: 'Vishnu Institute of Technology, Bhimavaram',
    expertise: ['Database Management Systems (DBMS)', 'SQL Optimization', 'Relational Database Architecture'],
    bio: '20+ years of academic and industry research leadership in Database Systems, SQL Querying, and System Architecture at VITB.',
    rating: 4.98,
    sessionsCount: 124,
    availableFor: 'DBMS Lab Verification, SQL Optimization & 1:1 Guidance',
  },
  {
    id: 'm1',
    name: 'Dr. Suresh Menon',
    role: 'Associate Professor',
    type: 'FACULTY',
    organization: 'Vishnu Tech AI Lab',
    expertise: ['Machine Learning', 'Natural Language Processing', 'Data Mining'],
    bio: 'PhD from IISc with 15+ years experience in AI research and industry consultancy.',
    rating: 4.9,
    sessionsCount: 42,
    availableFor: '1:1 Guidance & Research Project Supervision',
  },
  {
    id: 'm2',
    name: 'Meera Krishnan',
    role: 'Engineering Manager',
    type: 'INDUSTRY',
    organization: 'NovaStack Technologies',
    expertise: ['Backend Architecture', 'Python / FastAPI', 'PostgreSQL', 'Distributed Systems'],
    bio: '10+ years in backend engineering. Hired and mentored 50+ junior engineers and interns.',
    rating: 4.95,
    sessionsCount: 68,
    availableFor: 'Mock Technical Interviews & Resume Review',
  },
  {
    id: 'm3',
    name: 'Vikramaditya Roy',
    role: 'Principal Cloud Architect',
    type: 'INDUSTRY',
    organization: 'CloudForge Innovations',
    expertise: ['Cloud Native', 'Kubernetes', 'AWS Architecture', 'DevOps'],
    bio: 'AWS Certified Solutions Architect Passionate about helping students build cloud engineering careers.',
    rating: 4.85,
    sessionsCount: 35,
    availableFor: 'Cloud Career Roadmaps & Architecture Feedback',
  },
];

export default function MentorshipPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [bookedMentor, setBookedMentor] = useState<string | null>(null);

  const filteredMentors = SAMPLE_MENTORS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.expertise.some((e) => e.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Booking confirmation banner */}
      {bookedMentor && (
        <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-warm)] text-[var(--primary-green)] text-xs font-semibold flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-[var(--primary-green)]" />
            <span>1:1 Session request submitted for <strong>{bookedMentor}</strong>! Instant calendar invite dispatched to your institutional email.</span>
          </div>
          <button onClick={() => setBookedMentor(null)} className="font-bold hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-warm)]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-green)] mb-0.5">
            1:1 Faculty & Industry Advisory
          </div>
          <h1 className="text-h1 flex items-center gap-2 text-[var(--text-primary)]">
            <Users className="w-6 h-6 text-[var(--primary-dark)]" />
            Academia-Industry Mentorship Network
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Connect 1:1 with university professors & senior software engineers matched to your career goals.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface-paper)] p-3 rounded-lg border border-[var(--border-warm)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by mentor name or expertise (e.g. DBMS, Dr. Subba Rao Sir, Python)..."
            className="w-full pl-9 pr-4 py-2 rounded-md text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-dark)]"
          />
        </div>

        <div className="flex items-center gap-1 bg-[var(--surface-bg)] p-1 rounded-lg border border-[var(--border-warm)]">
          {['ALL', 'FACULTY', 'INDUSTRY'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === t
                  ? 'bg-[var(--primary-dark)] text-[var(--text-inverse)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <motion.div
            key={mentor.id}
            whileHover={{ y: -3 }}
            className="surface-card p-6 rounded-xl bg-[var(--surface-paper)] border border-[var(--border-warm)] hover:border-[var(--primary-green)] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--primary-dark)] text-[var(--text-inverse)] font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    {mentor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)] leading-tight">
                      {mentor.name}
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                      {mentor.role} • {mentor.organization}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--surface-subtle)] text-[var(--primary-green)] border border-[var(--border-warm)]">
                  {mentor.type}
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">{mentor.bio}</p>

              {/* Expertise tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {mentor.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--border-warm)]"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-warm)] flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-bold text-[var(--accent-saffron)]">
                <Star className="w-3.5 h-3.5 fill-[var(--accent-saffron)]" />
                <span>{mentor.rating}</span>
                <span className="text-[var(--text-tertiary)] font-normal">({mentor.sessionsCount} sessions)</span>
              </div>

              <button
                onClick={() => setBookedMentor(mentor.name)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-[var(--text-inverse)] bg-[var(--primary-dark)] hover:bg-[var(--primary-green)] transition-all cursor-pointer shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" /> Book 1:1 Session
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
