'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Star,
  CheckCircle2,
  Award,
  BookOpen,
  Code2,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Share2,
  Briefcase,
  GraduationCap,
  Upload,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

const DEMO_PORTFOLIO_PROFILE = {
  firstName: 'Vinay',
  lastName: 'Kumar Reddy',
  bio: 'Computer Science & Engineering student at Vishnu Institute of Technology, Bhimavaram. Specialized in Full-Stack Web Development, Data Structures, and Cloud Architecture.',
  city: 'Bhimavaram',
  state: 'Andhra Pradesh',
  linkedinUrl: 'https://www.linkedin.com/in/n-vinay-kumar-reddy/',
  githubUrl: 'https://github.com/ViNaY-9490',
  portfolioUrl: 'https://vinaykumarreddy.dev',
  placementReadinessScore: 84,
  skills: [
    { id: 's1', skill: { name: 'Python & Data Structures' }, computedLevel: 'ADVANCED', verificationStatus: 'VERIFIED' },
    { id: 's2', skill: { name: 'React & TypeScript' }, computedLevel: 'ADVANCED', verificationStatus: 'VERIFIED' },
    { id: 's3', skill: { name: 'SQL & Database Design' }, computedLevel: 'INTERMEDIATE', verificationStatus: 'VERIFIED' },
    { id: 's4', skill: { name: 'REST API & NestJS' }, computedLevel: 'INTERMEDIATE', verificationStatus: 'VERIFIED' },
    { id: 's5', skill: { name: 'Docker & Containerization' }, computedLevel: 'BEGINNER', verificationStatus: 'PENDING' },
  ],
  projects: [
    {
      id: 'p1',
      title: 'SkillSync Intelligence Engine',
      description: 'Academia-Industry skill mapping platform utilizing Next.js, TypeScript, and NestJS.',
      techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'NestJS'],
      repoUrl: 'https://github.com/aarav-sharma-dev/skillsync-engine',
    },
    {
      id: 'p2',
      title: 'Distributed Log Aggregator',
      description: 'High-throughput log analyzer built with Python and Docker containerized pipelines.',
      techStack: ['Python', 'Docker', 'Redis', 'PostgreSQL'],
      repoUrl: 'https://github.com/aarav-sharma-dev/log-aggregator',
    },
  ],
  certifications: [
    { id: 'c1', title: 'AWS Certified Cloud Practitioner', issuedBy: 'Amazon Web Services', issuedAt: '2025' },
    { id: 'c2', title: 'Full-Stack Software Engineering Specialization', issuedBy: 'Coursera / Meta', issuedAt: '2025' },
  ],
  educations: [
    {
      id: 'e1',
      institution: 'Vishnu Institute of Technology, Bhimavaram',
      degree: 'B.Tech',
      field: 'Computer Science & Engineering',
      cgpa: 8.7,
      startYear: 2023,
      endYear: 2027,
    },
  ],
};

export default function PortfolioPage() {
  const { user: authStoreUser, updateProfile } = useAuthStore();
  const { data: queryData, isLoading } = useQuery({
    queryKey: ['student-portfolio'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/students/profile');
        if (data && data.firstName) return data;
        return DEMO_PORTFOLIO_PROFILE;
      } catch {
        return DEMO_PORTFOLIO_PROFILE;
      }
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        updateProfile({ avatarUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="surface-card p-8 skeleton h-48 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="surface-card p-6 skeleton h-64 rounded-xl" />
          <div className="surface-card p-6 skeleton h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  const profile = queryData || DEMO_PORTFOLIO_PROFILE;

  const {
    firstName = authStoreUser?.firstName || 'Vinay',
    lastName = authStoreUser?.lastName || 'Kumar Reddy',
    bio = 'Computer Science & Engineering student at Vishnu Institute of Technology, Bhimavaram.',
    city = 'Bhimavaram',
    state = 'Andhra Pradesh',
    linkedinUrl = authStoreUser?.linkedinUrl || 'https://www.linkedin.com/in/n-vinay-kumar-reddy/',
    githubUrl = authStoreUser?.githubUrl || 'https://github.com/ViNaY-9490',
    skills = DEMO_PORTFOLIO_PROFILE.skills,
    projects = DEMO_PORTFOLIO_PROFILE.projects,
    certifications = DEMO_PORTFOLIO_PROFILE.certifications,
    educations = DEMO_PORTFOLIO_PROFILE.educations,
    placementReadinessScore = 84,
  } = profile;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="surface-card p-6 md:p-8 bg-[var(--surface-paper)] border border-[var(--border-warm)] rounded-xl relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group">
              {authStoreUser?.avatarUrl ? (
                <img
                  src={authStoreUser.avatarUrl}
                  alt="Profile Avatar"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-[var(--primary-dark)] shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[var(--primary-dark)] text-[var(--text-inverse)] font-bold text-2xl flex items-center justify-center shadow-md">
                  {firstName.charAt(0)}
                  {lastName.charAt(0)}
                </div>
              )}

              <label
                htmlFor="portfolio-avatar-upload"
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[var(--primary-dark)] text-[var(--text-inverse)] hover:bg-[var(--primary-green)] shadow-md cursor-pointer transition-colors"
                title="Upload Profile Picture"
              >
                <Upload className="w-3 h-3" />
              </label>
              <input
                id="portfolio-avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-h2 text-[var(--text-primary)]">{firstName} {lastName}</h1>
                <span className="bg-[var(--surface-subtle)] text-[var(--primary-green)] border border-[var(--border-warm)] text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[var(--primary-green)]" /> Skill Verified
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl line-clamp-2">{bio}</p>
              <div className="flex items-center gap-4 mt-2.5 text-xs text-[var(--text-tertiary)]">
                {city && <span>📍 {city}, {state}</span>}
                {educations?.[0] && <span>🎓 {educations[0].institution}</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-3">
            <div className="md:text-right">
              <div className="text-xs font-semibold text-[var(--text-tertiary)]">READINESS SCORE</div>
              <div className="text-2xl font-bold text-[var(--primary-dark)]">{placementReadinessScore}/100</div>
            </div>

            <div className="flex items-center gap-2">
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[var(--surface-bg)] hover:bg-[var(--surface-subtle)] transition-colors border border-[var(--border-warm)]">
                  <Github className="w-4 h-4 text-[var(--text-primary)]" />
                </a>
              )}
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[var(--surface-bg)] hover:bg-[var(--surface-subtle)] transition-colors border border-[var(--border-warm)]">
                  <Linkedin className="w-4 h-4 text-[var(--text-primary)]" />
                </a>
              )}
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--primary-dark)] text-[var(--text-inverse)] hover:bg-[var(--primary-green)] font-semibold text-xs transition-colors shadow-sm cursor-pointer">
                <Share2 className="w-3.5 h-3.5" /> Share Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Skills & Education */}
        <div className="space-y-6">
          {/* Verified Skills */}
          <div className="surface-card p-6 rounded-xl border border-[var(--border-warm)] bg-[var(--surface-paper)]">
            <h2 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-[var(--primary-green)]" />
              Verified Skills
            </h2>
            <div className="space-y-2">
              {skills?.map((s: { id: string; skill: { name: string }; computedLevel: string; verificationStatus?: string }) => (
                <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--surface-bg)] border border-[var(--border-subtle)]">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">{s.skill.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--surface-subtle)] text-[var(--primary-dark)]">
                    {s.computedLevel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="surface-card p-6 rounded-xl border border-[var(--border-warm)] bg-[var(--surface-paper)]">
            <h2 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2 mb-4">
              <GraduationCap className="w-4 h-4 text-[var(--primary-dark)]" />
              Education
            </h2>
            {educations?.map((edu: { id: string; institution: string; degree: string; field: string; cgpa?: number; startYear: number; endYear: number }) => (
              <div key={edu.id} className="border-l-2 border-[var(--primary-green)] pl-3 py-1 space-y-1">
                <div className="font-bold text-xs text-[var(--text-primary)]">{edu.degree} in {edu.field}</div>
                <div className="text-[11px] font-medium text-[var(--text-secondary)]">{edu.institution}</div>
                <div className="text-[10px] text-[var(--text-tertiary)]">{edu.startYear} - {edu.endYear} | CGPA: {edu.cgpa || '8.7'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Featured Projects & Certifications */}
        <div className="md:col-span-2 space-y-6">
          {/* Projects */}
          <div className="surface-card p-6 rounded-xl border border-[var(--border-warm)] bg-[var(--surface-paper)]">
            <h2 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2 mb-4">
              <Code2 className="w-4 h-4 text-[var(--primary-dark)]" />
              Featured Portfolio Projects
            </h2>

            <div className="space-y-4">
              {projects?.map((proj: { id: string; title: string; description: string; techStack: string[]; repoUrl?: string }) => (
                <div key={proj.id} className="p-4 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-subtle)]">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-xs text-[var(--text-primary)]">{proj.title}</h3>
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-[11px] text-[var(--primary-green)] font-semibold flex items-center gap-1 hover:underline">
                        Code <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">{proj.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {proj.techStack?.map((t: string) => (
                      <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--surface-paper)] text-[var(--text-primary)] border border-[var(--border-warm)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="surface-card p-6 rounded-xl border border-[var(--border-warm)] bg-[var(--surface-paper)]">
            <h2 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[var(--accent-saffron)]" />
              Certifications & Credentials
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certifications?.map((cert: { id: string; title: string; issuedBy: string; issuedAt?: string }) => (
                <div key={cert.id} className="p-3.5 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-subtle)] flex items-start gap-3">
                  <Award className="w-4 h-4 text-[var(--accent-saffron)] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs text-[var(--text-primary)]">{cert.title}</div>
                    <div className="text-[11px] text-[var(--text-secondary)]">{cert.issuedBy} ({cert.issuedAt || '2025'})</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
