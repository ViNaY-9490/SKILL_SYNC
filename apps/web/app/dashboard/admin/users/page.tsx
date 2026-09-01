'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Shield, UserX, UserCheck, Lock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', search, selectedRole],
    queryFn: async () => {
      const res = await api.get(`/admin/users?search=${search}${selectedRole !== 'ALL' ? `&role=${selectedRole}` : ''}`);
      return res.data || [];
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return api.patch(`/admin/users/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const roles = ['ALL', 'STUDENT', 'INDUSTRY', 'FACULTY', 'INSTITUTION_ADMIN', 'PLACEMENT_OFFICER', 'SUPER_ADMIN'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Platform User Administration
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Global user management, role assignments, and account status controls across all system roles.
        </p>
      </div>

      {/* Role filter bar */}
      <div className="flex gap-2 border-b overflow-x-auto pb-2" style={{ borderColor: 'var(--border-subtle)' }}>
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRole(r)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedRole === r ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {r.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl border flex items-center gap-3" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      {/* User Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'var(--surface-0)' }} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs font-semibold uppercase" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                <th className="p-4">User Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm" style={{ borderColor: 'var(--border-subtle)' }}>
              {users?.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{u.email}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">{u.role}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatusMutation.mutate({ id: u.id, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' })}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${u.status === 'ACTIVE' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                    >
                      {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
