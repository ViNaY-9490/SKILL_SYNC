'use client';

import { motion } from 'framer-motion';
import { Building2, ShieldCheck, ExternalLink, Handshake } from 'lucide-react';

export default function InstitutionIndustryPage() {
  const partners = [
    { name: 'Google Cloud Platform', domain: 'Cloud & AI', status: 'ACTIVE_MOU', drivesConducted: 4 },
    { name: 'Microsoft Azure', domain: 'Enterprise Software', status: 'ACTIVE_MOU', drivesConducted: 6 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Corporate Industry Partners & MoUs
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Manage corporate relationships, Memorandum of Understanding agreements, and hiring tie-ups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partners.map((p, idx) => (
          <motion.div key={idx} className="p-5 rounded-2xl border space-y-3" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
                <p className="text-xs text-gray-500">{p.domain}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Active MoU
              </span>
            </div>
            <p className="text-xs text-gray-400">{p.drivesConducted} Recruitment drives conducted</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
