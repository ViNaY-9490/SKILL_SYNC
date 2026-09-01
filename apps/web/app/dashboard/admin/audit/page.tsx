'use client';

import { motion } from 'framer-motion';
import { Shield, Clock, User, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function AdminAuditPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const res = await api.get('/admin/audit-logs');
      return res.data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Security Audit Trail Logs
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Append-only immutable record of all administrative, authentication, and role modification actions.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'var(--surface-0)' }} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs font-semibold uppercase" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Resource</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs font-mono" style={{ borderColor: 'var(--border-subtle)' }}>
              {logs?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center font-sans text-gray-500">No audit logs recorded yet</td>
                </tr>
              ) : (
                logs?.map((l: any) => (
                  <tr key={l.id}>
                    <td className="p-4">{l.actor?.email || 'SYSTEM'}</td>
                    <td className="p-4 font-bold text-indigo-600">{l.action}</td>
                    <td className="p-4">{l.resource || 'USER_AUTH'}</td>
                    <td className="p-4 text-gray-400">{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
