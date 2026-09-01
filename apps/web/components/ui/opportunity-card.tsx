'use client';

import React from 'react';
import { MapPin, Clock, Building2, CheckCircle2, ChevronRight, Sparkles, Calendar } from 'lucide-react';
import { Button } from './button';

export interface OpportunityCardProps {
  id: string;
  title: string;
  companyName: string;
  location?: string;
  type?: string;
  stipend?: string;
  duration?: string;
  matchScore?: number;
  matchReasons?: string[];
  skillsRequired?: string[];
  applied?: boolean;
  onApply?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function OpportunityCard({
  id,
  title,
  companyName,
  location = 'Hyderabad · Hybrid',
  type = 'Internship',
  stipend = '₹35,000 / month',
  duration = '6 Months',
  matchScore = 88,
  matchReasons = [
    'Direct alignment with verified skills: Python, SQL, REST APIs',
    'Verified academic coursework under Dr. Subba Rao Sir',
    'Matched institutional referral tier',
  ],
  skillsRequired = ['Python', 'SQL & DBMS', 'REST API Design'],
  applied = false,
  onApply,
  onViewDetails,
}: OpportunityCardProps) {
  return (
    <div className="surface-card p-5 bg-[var(--surface-paper)] border border-[var(--border-warm)] hover:border-[var(--primary-green)] transition-all flex flex-col justify-between h-full">
      <div>
        {/* Header: Title & Company */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] mb-1">
              <Building2 className="w-3.5 h-3.5 text-[var(--primary-green)]" />
              {companyName}
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)] line-clamp-1">{title}</h3>
          </div>

          {/* Match Badge */}
          {matchScore > 0 && (
            <div className="flex-shrink-0 bg-[var(--surface-subtle)] border border-[var(--border-warm)] px-2.5 py-1 rounded-lg text-right">
              <div className="text-xs font-bold text-[var(--primary-green)] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[var(--accent-saffron)]" />
                {matchScore}% Match
              </div>
            </div>
          )}
        </div>

        {/* Metadata Chips */}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[var(--primary-green)]" />
            {location}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[var(--primary-green)]" />
            {duration}
          </span>
          <span>•</span>
          <span className="font-bold text-[var(--primary-dark)]">{stipend}</span>
        </div>

        {/* Skills Required */}
        <div className="mt-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5">
            Required Competencies
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skillsRequired.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--border-warm)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Why this matches you */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-[var(--surface-bg)] border border-[var(--border-warm)]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--primary-green)] mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[var(--primary-green)]" />
              Why this matches you
            </div>
            <ul className="space-y-0.5">
              {matchReasons.map((reason, idx) => (
                <li key={idx} className="text-xs text-[var(--text-secondary)] flex items-start gap-1.5">
                  <span className="text-[var(--accent-saffron)] font-bold">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="flex items-center justify-between gap-3 mt-5 pt-3 border-t border-[var(--border-warm)]">
        <button
          onClick={() => onViewDetails && onViewDetails(id)}
          className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1 hover:text-[var(--primary-green)] transition-colors cursor-pointer"
        >
          View Details <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <Button
          onClick={() => onApply && onApply(id)}
          variant={applied ? 'outline' : 'primary'}
          size="sm"
          disabled={applied}
        >
          {applied ? 'Applied' : 'Apply Now'}
        </Button>
      </div>
    </div>
  );
}
