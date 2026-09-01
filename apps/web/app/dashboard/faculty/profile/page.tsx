'use client';

import { useState } from 'react';
import { GraduationCap, Save, Check } from 'lucide-react';

export default function FacultyProfilePage() {
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Faculty Academic Profile
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Update academic designation, department affiliation, and research domain expertise.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}>
        <div>
          <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>Designation</label>
          <input
            type="text"
            defaultValue="Associate Professor"
            className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>Department</label>
          <input
            type="text"
            defaultValue="Computer Science & Engineering"
            className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          {saved && <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Profile saved</span>}
          <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
