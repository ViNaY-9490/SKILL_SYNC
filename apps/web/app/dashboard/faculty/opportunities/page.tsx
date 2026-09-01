'use client';

import { motion } from 'framer-motion';
import { Briefcase, BookOpen, Users, ArrowRight, Award } from 'lucide-react';

export default function FacultyOpportunitiesPage() {
  const projects = [
    { id: '1', title: 'AI-Based Crop Yield Prediction Model', company: 'AgriTech Labs', studentsNeeded: 4, stipend: '₹12,000/mo' },
    { id: '2', title: 'Distributed Ledger for Supply Chain Auditability', company: 'LogiGlobal Corp', studentsNeeded: 3, stipend: '₹15,000/mo' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Live Industry Projects & Consultancy
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Review live industry projects submitted by recruiters and nominate student cohorts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((proj) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">Industry Live Project</span>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{proj.title}</h3>
              <p className="text-xs text-gray-500">Partner Organization: {proj.company} | Stipend: {proj.stipend}</p>
            </div>

            <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 flex items-center gap-1">
              Nominate Student Team <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
