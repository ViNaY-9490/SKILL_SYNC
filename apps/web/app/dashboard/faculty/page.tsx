'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  Briefcase,
  Award,
  Calendar,
  Plus,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FacultyDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDE2DC]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#256B58] mb-0.5">
            Academic Faculty Portal
          </div>
          <h1 className="text-h1 text-[#17231F]">Dr. Suresh Menon</h1>
          <p className="text-xs text-[#58645F] mt-0.5">
            Department of Computer Science & Engineering · Vishnu Institute of Technology, Bhimavaram
          </p>
        </div>

        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4" />
          Propose Industry Research Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Mentees Assigned', value: 14 },
          { icon: BookOpen, label: 'Joint R&D Projects', value: 3 },
          { icon: Briefcase, label: 'Industry Consultancies', value: 2 },
          { icon: Award, label: 'FDP Credits', value: '45/50' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="surface-card p-4">
            <div className="w-8 h-8 rounded-lg bg-[#E4ECE7] text-[#173F35] flex items-center justify-center mb-2">
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold text-[#17231F]">{value}</div>
            <div className="text-xs text-[#58645F]">{label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mentorship Requests */}
        <div className="surface-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#17231F]">Active Student Mentorship Sessions</h2>
            <span className="text-xs font-bold text-[#E38B32]">3 Pending</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Aarav Sharma', topic: 'Ayush Pharmacovigilance Career Guidance', date: 'Tomorrow, 4:00 PM' },
              { name: 'Priya Nair', topic: 'Clinical Trial Evidence Verification', date: 'Thu, 2:30 PM' },
            ].map((session) => (
              <div key={session.name} className="p-3.5 rounded-lg bg-[#FCFBF7] border border-[#EBEFEA] flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#17231F]">{session.name}</div>
                  <div className="text-[11px] text-[#58645F]">{session.topic}</div>
                  <div className="text-[10px] text-[#173F35] font-semibold mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#A7BDAF]" /> {session.date}
                  </div>
                </div>
                <Button size="sm" variant="secondary">
                  Accept
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Research Collaborations */}
        <div className="surface-card p-5 space-y-4">
          <h2 className="font-bold text-sm text-[#17231F]">Industry Research Collaborations</h2>
          <div className="space-y-3">
            {[
              { company: 'Himalaya Wellness Org', project: 'Herbal Drug Efficacy Standardization', budget: '₹5.5 Lakhs Consultancy' },
              { company: 'Dabur Research Foundation', project: 'Clinical Trial Data Analytics', budget: 'Joint R&D Project' },
            ].map((collab) => (
              <div key={collab.project} className="p-3.5 rounded-lg bg-[#FCFBF7] border border-[#EBEFEA]">
                <div className="text-xs font-bold text-[#173F35]">{collab.company}</div>
                <div className="font-bold text-xs text-[#17231F] mt-0.5">{collab.project}</div>
                <div className="text-[11px] text-[#58645F] mt-1">{collab.budget}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
