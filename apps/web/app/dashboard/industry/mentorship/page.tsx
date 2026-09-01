'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, MessageSquare, Plus, Clock, CheckCircle } from 'lucide-react';

export default function IndustryMentorshipPage() {
  const [requests] = useState([
    { id: '1', studentName: 'Aarav Sharma', topic: 'Backend Architecture & Microservices', status: 'ACTIVE', date: 'Tomorrow, 4:00 PM' },
    { id: '2', studentName: 'Priya Patel', topic: 'Frontend Optimization & Next.js App Router', status: 'PENDING', date: 'Fri, Sep 5, 2:00 PM' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Corporate Mentorship Program
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Guide student talent, conduct 1-on-1 mentorship sessions, and build direct hiring pipelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((req) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl border space-y-3"
            style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{req.studentName}</h3>
                <p className="text-xs text-emerald-600 font-semibold">{req.topic}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${req.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {req.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <Calendar className="w-3.5 h-3.5" />
              <span>{req.date}</span>
            </div>

            <div className="pt-2 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700">
                Join Session
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
