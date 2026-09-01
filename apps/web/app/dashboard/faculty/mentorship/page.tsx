'use client';

import { motion } from 'framer-motion';
import { Users, CheckCircle, Clock, Award, ShieldCheck } from 'lucide-react';

export default function FacultyMentorshipPage() {
  const Mentees = [
    { id: '1', name: 'Rohan Verma', roll: '21CS104', targetRole: 'Cloud Solutions Architect', verifiedSkills: 8 },
    { id: '2', name: 'Ananya Gupta', roll: '21CS089', targetRole: 'Data Scientist', verifiedSkills: 6 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Faculty Student Mentorship & Skill Endorsements
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Track student progress, verify practical lab projects, and endorse student skill proficiencies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Mentees.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl border space-y-3"
            style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{m.name}</h3>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Roll No: {m.roll} | Target: {m.targetRole}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {m.verifiedSkills} Skills Verified
              </span>
            </div>

            <div className="pt-2 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Endorse Skills
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
