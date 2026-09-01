'use client';

import { motion } from 'framer-motion';
import { BarChart3, FileSpreadsheet, Download, Award, ShieldCheck } from 'lucide-react';

export default function InstitutionReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Accreditation & Skill Intelligence Reports
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Generate NAAC Criterion 5, NIRF ranking data, and industry readiness reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border space-y-3" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <Award className="w-8 h-8 text-pink-500" />
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>NAAC Skill Metric Audit</h3>
          <p className="text-xs text-gray-500">Student skill verification, placement records, and industry mentorship evidence.</p>
          <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Download NAAC Report (PDF)
          </button>
        </div>

        <div className="p-6 rounded-2xl border space-y-3" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <FileSpreadsheet className="w-8 h-8 text-indigo-500" />
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>NIRF Placement Data Matrix</h3>
          <p className="text-xs text-gray-500">Graduation outcome metrics, median salaries, and corporate placement statistics.</p>
          <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Download NIRF Sheet (XLSX)
          </button>
        </div>
      </div>
    </div>
  );
}
