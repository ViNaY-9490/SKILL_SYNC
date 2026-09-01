'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { AppShell } from '@/components/layout/app-shell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('skillsync-auth');
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          if (parsed?.state?.user && parsed?.state?.isAuthenticated) {
            useAuthStore.setState({
              user: parsed.state.user,
              accessToken: parsed.state.accessToken || 'demo_access_token_prototype',
              isAuthenticated: true,
            });
          }
        } catch {
          // ignore parsing error
        }
      }
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady && !isAuthenticated && !user) {
      const storedAuth = typeof window !== 'undefined' ? localStorage.getItem('skillsync-auth') : null;
      if (!storedAuth) {
        router.replace('/login');
      }
    }
  }, [isReady, isAuthenticated, user, router]);

  if (!isReady || (!isAuthenticated && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-bg)] text-[var(--text-primary)]">
        <div className="text-center p-6 surface-card rounded-xl border border-[var(--border-warm)] shadow-sm">
          <div className="w-10 h-10 rounded-lg mx-auto mb-3 bg-[var(--primary-dark)] text-[var(--text-inverse)] font-bold text-sm flex items-center justify-center">
            SS
          </div>
          <div className="text-xs font-semibold text-[var(--text-secondary)] animate-pulse">
            Authenticating workspace session...
          </div>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
