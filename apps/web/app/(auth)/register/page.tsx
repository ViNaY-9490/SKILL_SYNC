'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, GraduationCap, Building2, BookOpen, School, ArrowRight } from 'lucide-react';
import { useAuthStore, type UserRole } from '@/store/auth.store';
import { Button } from '@/components/ui/button';

const ROLES = [
  {
    value: 'STUDENT' as UserRole,
    label: 'Student / Scholar',
    icon: GraduationCap,
    desc: 'Map competencies, analyze gaps, and find placement opportunities.',
  },
  {
    value: 'INDUSTRY' as UserRole,
    label: 'Industry Recruiter',
    icon: Building2,
    desc: 'Discover skill-verified candidates and publish internship listings.',
  },
  {
    value: 'FACULTY' as UserRole,
    label: 'Academic Faculty',
    icon: BookOpen,
    desc: 'Collaborate with industry on R&D, mentor, and track student readiness.',
  },
  {
    value: 'INSTITUTION_ADMIN' as UserRole,
    label: 'Institution Admin',
    icon: School,
    desc: 'Manage placement drives, curriculum mapping, and institutional analytics.',
  },
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

function RegisterFormContent() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { register: registerUser, isLoading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const roleParam = searchParams.get('role') as UserRole | null;
  if (roleParam && !selectedRole && ROLES.find(r => r.value === roleParam)) {
    setSelectedRole(roleParam);
    setStep(2);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select your institutional role');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await registerUser({
        email: form.email,
        password: form.password,
        role: selectedRole,
        firstName: form.firstName,
        lastName: form.lastName,
      });

      const { user } = useAuthStore.getState();
      if (user) {
        router.push(getRoleDashboard(user.role));
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#173F35] text-[#FCFBF7] font-bold text-sm flex items-center justify-center">
            SS
          </div>
          <span className="font-bold text-base text-[#17231F]">SkillSync</span>
        </Link>
        <h1 className="text-h2 text-[#17231F]">Create Institutional Account</h1>
        <p className="text-xs text-[#58645F] mt-0.5">Join the Vishnu Institute of Technology Skill Intelligence Portal</p>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#FCFBF7] border border-[#DDE2DC] rounded-xl p-6 shadow-sm"
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-6 pb-4 border-b border-[#F0EDE6]">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#173F35] text-[#FCFBF7]' : 'bg-[#F0EDE6] text-[#829189]'}`}>
              1
            </span>
            <span className="text-xs font-semibold text-[#17231F]">Select Role</span>
          </div>
          <div className="w-8 h-0.5 bg-[#DDE2DC]" />
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#173F35] text-[#FCFBF7]' : 'bg-[#F0EDE6] text-[#829189]'}`}>
              2
            </span>
            <span className="text-xs font-semibold text-[#17231F]">Credentials</span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg text-xs bg-[#F9EFEB] text-[#8A412A] border border-[#E2BCB0] mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#B9674B]" />
            {error}
          </div>
        )}

        {/* Step 1 — Role selection */}
        {step === 1 && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-[#58645F] uppercase tracking-wider mb-2">
              Select Your Primary Role
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLES.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.value}
                    onClick={() => { setSelectedRole(role.value); setStep(2); }}
                    className="p-4 rounded-lg border border-[#DDE2DC] bg-[#FFFFFF] hover:border-[#173F35] text-left transition-all hover:bg-[#F7F5EF] flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-[#E4ECE7] text-[#173F35] flex items-center justify-center mb-2">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs text-[#17231F] mb-1">{role.label}</div>
                      <div className="text-[11px] text-[#58645F]">{role.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2 — Details */}
        {step === 2 && selectedRole && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EDE6]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-[#173F35] hover:underline"
              >
                ← Change Role
              </button>
              <span className="text-xs text-[#58645F]">
                Joining as: <strong className="text-[#17231F]">{ROLES.find(r => r.value === selectedRole)?.label}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(['firstName', 'lastName'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-[#17231F] mb-1">
                    {field === 'firstName' ? 'First Name' : 'Last Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form[field]}
                    onChange={(e) => setForm(f => ({ ...f, [field]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-md text-xs bg-[#FFFFFF] border border-[#DDE2DC] text-[#17231F] outline-none focus:border-[#173F35]"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17231F] mb-1">
                Institutional Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@institution.ac.in"
                className="w-full px-3 py-2 rounded-md text-xs bg-[#FFFFFF] border border-[#DDE2DC] text-[#17231F] outline-none focus:border-[#173F35]"
              />
            </div>

            {(['password', 'confirmPassword'] as const).map((field) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-[#17231F] mb-1">
                  {field === 'password' ? 'Password' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form[field]}
                    onChange={(e) => setForm(f => ({ ...f, [field]: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 pr-9 rounded-md text-xs bg-[#FFFFFF] border border-[#DDE2DC] text-[#17231F] outline-none focus:border-[#173F35]"
                  />
                  {field === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#829189]"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <Button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              variant="primary"
              className="w-full mt-2"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Creating Account...</>
              ) : (
                'Complete Registration'
              )}
            </Button>
          </form>
        )}
      </motion.div>

      <p className="text-center text-xs text-[#58645F] mt-4">
        Already registered?{' '}
        <Link href="/login" className="font-semibold text-[#173F35] hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F7F5EF]">
      <Suspense fallback={<div className="text-xs text-[#58645F]">Loading registration...</div>}>
        <RegisterFormContent />
      </Suspense>
    </div>
  );
}
