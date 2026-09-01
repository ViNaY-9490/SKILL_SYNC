'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 text-center"
      style={{ background: 'var(--surface-1)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full p-8 rounded-2xl border backdrop-blur-sm"
        style={{
          background: 'var(--surface-0)',
          borderColor: 'var(--border-subtle)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl font-black text-white"
          style={{ background: 'linear-gradient(135deg, #6172f3, #10b981)' }}
        >
          404
        </div>
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Page Not Found
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          The page or skill vector you are looking for might have been moved, renamed, or does not exist in the taxonomy.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/student"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'var(--brand)' }}
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <Link
            href="/explore"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          >
            <Search className="w-4 h-4" />
            Explore Skill Platform
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
