'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Brain,
  Target,
  Briefcase,
  FileText,
  Star,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  GraduationCap,
  BarChart3,
  Users,
  BookOpen,
  Zap,
  TrendingUp,
  Shield,
  Layers,
} from 'lucide-react';
import { useAuthStore, type UserRole } from '@/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ThemeToggle } from '@/components/theme-toggle';

// ============================================================
// NAV CONFIGS PER ROLE
// ============================================================
function getNavItems(role: UserRole) {
  switch (role) {
    case 'STUDENT':
      return [
        { label: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
        { label: 'Skill Map', href: '/dashboard/student/skills', icon: Brain },
        { label: 'Gap Analysis', href: '/dashboard/student/skills/gaps', icon: Target },
        { label: 'Opportunities', href: '/dashboard/student/opportunities', icon: TrendingUp },
        { label: 'Applications', href: '/dashboard/student/applications', icon: Briefcase },
        { label: 'Assessments', href: '/dashboard/student/assessments', icon: BarChart3 },
        { label: 'Portfolio', href: '/dashboard/student/portfolio', icon: Star },
        { label: 'Learning Plan', href: '/dashboard/student/learning', icon: BookOpen },
        { label: 'Mentorship', href: '/dashboard/student/mentorship', icon: Users },
      ];
    case 'INDUSTRY':
      return [
        { label: 'Overview', href: '/dashboard/industry', icon: LayoutDashboard },
        { label: 'Opportunities', href: '/dashboard/industry/opportunities', icon: Briefcase },
        { label: 'Candidates', href: '/dashboard/industry/candidates', icon: Users },
        { label: 'Applications', href: '/dashboard/industry/applications', icon: FileText },
        { label: 'Skill Analytics', href: '/dashboard/industry/analytics', icon: BarChart3 },
        { label: 'Mentorship', href: '/dashboard/industry/mentorship', icon: Users },
        { label: 'Company Profile', href: '/dashboard/industry/profile', icon: Building2 },
      ];
    case 'FACULTY':
      return [
        { label: 'Overview', href: '/dashboard/faculty', icon: LayoutDashboard },
        { label: 'Opportunities', href: '/dashboard/faculty/opportunities', icon: Briefcase },
        { label: 'Mentorship', href: '/dashboard/faculty/mentorship', icon: Users },
        { label: 'Research & Collaboration', href: '/dashboard/faculty/research', icon: BookOpen },
        { label: 'Profile', href: '/dashboard/faculty/profile', icon: GraduationCap },
      ];
    case 'INSTITUTION_ADMIN':
    case 'PLACEMENT_OFFICER':
      return [
        { label: 'Overview', href: '/dashboard/institution', icon: LayoutDashboard },
        { label: 'Students', href: '/dashboard/institution/students', icon: GraduationCap },
        { label: 'Skill Analytics', href: '/dashboard/institution/skills', icon: Brain },
        { label: 'Placement Drives', href: '/dashboard/institution/placement', icon: Briefcase },
        { label: 'Industry Partners', href: '/dashboard/institution/industry', icon: Building2 },
        { label: 'Reports', href: '/dashboard/institution/reports', icon: BarChart3 },
      ];
    case 'SUPER_ADMIN':
      return [
        { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
        { label: 'Users', href: '/dashboard/admin/users', icon: Users },
        { label: 'Organizations', href: '/dashboard/admin/organizations', icon: Building2 },
        { label: 'Skill Taxonomy', href: '/dashboard/admin/skills', icon: Brain },
        { label: 'Opportunities', href: '/dashboard/admin/opportunities', icon: Briefcase },
        { label: 'Audit Logs', href: '/dashboard/admin/audit', icon: Shield },
        { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
      ];
    default:
      return [];
  }
}

function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    STUDENT: 'Student',
    INDUSTRY: 'Industry Partner',
    FACULTY: 'Academic Faculty',
    INSTITUTION_ADMIN: 'Institution Admin',
    PLACEMENT_OFFICER: 'Placement Officer',
    SUPER_ADMIN: 'Super Admin',
  };
  return labels[role] || role;
}

// ============================================================
// SIDEBAR COMPONENT
// ============================================================
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const navItems = getNavItems(user.role);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="flex flex-col h-full bg-[var(--surface-paper)] border-r border-[var(--border-warm)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary-dark)] text-[var(--text-inverse)] font-bold text-sm flex items-center justify-center shadow-sm">
            SS
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-[var(--text-primary)] block">
              SkillSync
            </span>
            <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider block truncate">
              Vishnu Institute of Tech
            </span>
          </div>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role Badge Banner */}
      <div className="px-4 py-3 bg-[var(--surface-paper)] border-b border-[var(--border-subtle)] flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--primary-dark)] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-saffron)]" />
          {getRoleLabel(user.role)}
        </span>
        <span className="text-[10px] uppercase font-bold text-[var(--text-tertiary)] bg-[var(--surface-bg)] px-2 py-0.5 rounded border border-[var(--border-warm)]">
          VITB Platform
        </span>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isExact = pathname === item.href;
          const isSubpath =
            item.href !== '/dashboard/student' &&
            item.href !== '/dashboard/industry' &&
            item.href !== '/dashboard/faculty' &&
            item.href !== '/dashboard/institution' &&
            item.href !== '/dashboard/admin' &&
            pathname.startsWith(item.href + '/') &&
            !navItems.some((other) => other.href !== item.href && pathname === other.href);

          const isActive = isExact || isSubpath;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[var(--primary-dark)] text-[var(--text-inverse)] font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[var(--text-inverse)]' : 'text-[var(--text-tertiary)]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[var(--border-warm)] bg-[var(--surface-bg)]">
        <div className="flex items-center gap-3 mb-3">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="User Avatar"
              className="w-9 h-9 rounded-lg object-cover border border-[var(--border-warm)] flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-[var(--primary-dark)] text-[var(--text-inverse)] font-bold text-xs flex items-center justify-center flex-shrink-0">
              {user.firstName ? user.firstName.charAt(0) : user.email.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
              {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email.split('@')[0]}
            </div>
            <div className="text-[11px] text-[var(--text-tertiary)] truncate">{user.email}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 text-xs font-semibold w-full px-3 py-2 rounded-lg bg-[var(--surface-paper)] border border-[var(--border-warm)] text-[var(--accent-terracotta)] hover:bg-[var(--surface-subtle)] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </nav>
  );
}

// ============================================================
// APP SHELL
// ============================================================
export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  const { data: notifications } = useQuery({
    queryKey: ['notifications-count'],
    queryFn: async () => {
      const { data } = await api.get('/notifications?limit=1&unread=true');
      return data;
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  const unreadCount = notifications?.total || 0;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--surface-bg)] text-[var(--text-primary)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 flex-shrink-0">
        <Sidebar isOpen={true} />
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 lg:hidden"
            >
              <Sidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between h-14 px-4 md:px-6 flex-shrink-0 bg-[var(--surface-paper)] border-b border-[var(--border-warm)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="font-bold text-[var(--text-primary)]">Academia–Industry Skill Intelligence Platform</span>
              <span className="text-[var(--text-tertiary)]">•</span>
              <span className="text-[var(--text-secondary)] font-medium">Vishnu Institute of Technology, Bhimavaram</span>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/dashboard/student/copilot"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--primary-dark)] text-[var(--text-inverse)] hover:bg-[var(--primary-green)] transition-all shadow-sm cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[var(--accent-saffron)] fill-current" />
              AI Skill Copilot
            </Link>

            {/* Notifications Icon */}
            <Link
              href="/dashboard/notifications"
              className="relative p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--accent-terracotta)] text-[var(--text-inverse)] text-[10px] flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
