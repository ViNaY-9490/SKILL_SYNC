'use client';

import { motion } from 'framer-motion';
import { BookOpen, FileCode, FlaskConical, ExternalLink } from 'lucide-react';

export default function FacultyResearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Industry-Academia Research Collaboration
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Joint R&D proposals, patent opportunities, and consultancy initiatives with corporate partners.
        </p>
      </div>

      <div className="p-8 text-center rounded-2xl border space-y-3" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
        <FlaskConical className="w-12 h-12 mx-auto text-amber-500" />
        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Research Grants & Open Calls</h3>
        <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Explore open call proposals for AI ethics, quantum computing algorithms, and sustainable energy smart grids.
        </p>
      </div>
    </div>
  );
}
