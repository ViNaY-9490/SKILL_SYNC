'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, Shield, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';

const DEMO_ACCOUNTS = [
  { label: 'Student Demo', email: 'student@skillsync.local', password: 'SkillSync@2026!' },
  { label: 'Recruiter Demo', email: 'industry@skillsync.local', password: 'SkillSync@2026!' },
  { label: 'Faculty Demo', email: 'faculty@skillsync.local', password: 'SkillSync@2026!' },
  { label: 'Institution Demo', email: 'institution@skillsync.local', password: 'SkillSync@2026!' },
  { label: 'Admin Demo', email: 'admin@skillsync.local', password: 'SkillSync@2026!' },
];

function getRoleDashboard(role: string): string {
  switch (role) {
    case 'STUDENT': return '/dashboard/student';
    case 'INDUSTRY': return '/dashboard/industry';
    case 'FACULTY': return '/dashboard/faculty';
    case 'INSTITUTION_ADMIN':
    case 'PLACEMENT_OFFICER': return '/dashboard/institution';
    case 'SUPER_ADMIN': return '/dashboard/admin';
    default: return '/dashboard';
  }
}

function LoginFormContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const showDemo = searchParams.get('demo') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const loggedUser = await login(email, password);
      if (loggedUser) {
        const dest = getRoleDashboard(loggedUser.role);
        router.replace(dest);
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Invalid email or password');
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    try {
      const loggedUser = await login(demoEmail, demoPassword);
      if (loggedUser) {
        const dest = getRoleDashboard(loggedUser.role);
        router.replace(dest);
      }
    } catch {
      setError('Demo login failed. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-[var(--surface-paper)] border border-[var(--border-warm)] rounded-xl p-8 shadow-sm"
    >
      {/* Brand Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary-dark)] text-[var(--text-inverse)] font-bold text-sm flex items-center justify-center">
            SS
          </div>
          <div>
            <span className="font-bold text-base text-[var(--text-primary)] block">SkillSync</span>
            <span className="text-[9px] uppercase font-bold text-[var(--text-tertiary)]">Vishnu Institute of Technology</span>
          </div>
        </div>
        <h1 className="text-h2 text-[var(--text-primary)]">Sign In to SkillSync</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Enter your institutional credentials or click a demo shortcut below.
        </p>
      </div>

      {/* Demo Quick Access - Always Visible */}
      <div className="mb-6 p-3.5 rounded-lg bg-[var(--surface-bg)] border border-[var(--border-warm)]">
        <p className="text-xs font-semibold text-[var(--primary-dark)] mb-2 flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-[var(--accent-saffron)]" />
          Quick 1-Click Demo Access
        </p>
        <div className="flex flex-wrap gap-1.5">
          {DEMO_ACCOUNTS.map((demo) => (
            <button
              key={demo.email}
              type="button"
              onClick={() => handleDemoLogin(demo.email, demo.password)}
              className="text-[11px] font-semibold px-2.5 py-1.5 rounded bg-[var(--surface-paper)] text-[var(--primary-dark)] border border-[var(--border-warm)] hover:bg-[var(--surface-subtle)] transition-colors active:scale-95 cursor-pointer"
              disabled={isLoading}
            >
              {demo.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg text-xs bg-[var(--surface-subtle)] text-[var(--accent-terracotta)] border border-[var(--border-warm)]">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-[var(--accent-terracotta)]" />
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
            Institutional Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@institution.ac.in"
            className="w-full px-3.5 py-2.5 rounded-md text-xs bg-[var(--surface-card)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-dark)]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 pr-10 rounded-md text-xs bg-[var(--surface-card)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-dark)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <Button
          id="login-submit"
          type="submit"
          disabled={isLoading}
          variant="primary"
          className="w-full mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Authenticating...
            </>
          ) : (
            'Sign In to Portal'
          )}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-[var(--border-warm)] text-center text-xs text-[var(--text-secondary)]">
        <span>Need an account? </span>
        <Link href="/register" className="font-semibold text-[var(--primary-dark)] hover:underline">
          Register for Access
        </Link>
        <span className="mx-2">•</span>
        <Link href="/login?demo=true" className="text-[var(--accent-saffron)] hover:underline font-semibold">
          Demo Mode
        </Link>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--surface-bg)] text-[var(--text-primary)]">
      <Suspense fallback={<div className="text-xs text-[var(--text-secondary)]">Loading authentication interface...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
