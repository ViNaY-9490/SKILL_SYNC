'use client';

import { motion } from 'framer-motion';
import { Building2, CheckCircle2, ShieldAlert, Check, X } from 'lucide-react';

export default function AdminOrganizationsPage() {
  const pendingOrgs = [
    { id: '1', name: 'Nexus Cloud Systems', type: 'INDUSTRY', domain: 'Cloud & AI Infrastructure', website: 'https://nexuscloud.io' },
    { id: '2', name: 'Apex Institute of Technology', type: 'INSTITUTION', domain: 'Autonomous Engineering College', website: 'https://apextech.edu.in' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Organization & Verification Queue
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Approve or reject newly registered company organizations and academic institutions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pendingOrgs.map((org) => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">{org.type}</span>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{org.name}</h3>
              <p className="text-xs text-gray-500">{org.domain} | {org.website}</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Approve & Verify
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Reject
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
