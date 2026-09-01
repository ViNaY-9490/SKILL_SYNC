'use client';

import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export type ApplicationStage = 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'ASSESSMENT' | 'INTERVIEW' | 'SELECTED' | 'REJECTED';

export interface ApplicationTimelineProps {
  currentStage: ApplicationStage;
  updatedAt?: string;
  notes?: string;
}

const STAGES: { stage: ApplicationStage; label: string }[] = [
  { stage: 'APPLIED', label: 'Applied' },
  { stage: 'UNDER_REVIEW', label: 'Under Review' },
  { stage: 'SHORTLISTED', label: 'Shortlisted' },
  { stage: 'INTERVIEW', label: 'Interview' },
  { stage: 'SELECTED', label: 'Decision' },
];

export function ApplicationTimeline({ currentStage, updatedAt, notes }: ApplicationTimelineProps) {
  const getStageIndex = (stage: ApplicationStage) => {
    switch (stage) {
      case 'APPLIED': return 0;
      case 'UNDER_REVIEW': return 1;
      case 'SHORTLISTED': return 2;
      case 'ASSESSMENT': return 2;
      case 'INTERVIEW': return 3;
      case 'SELECTED': return 4;
      case 'REJECTED': return -1;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(currentStage);
  const isRejected = currentStage === 'REJECTED';

  return (
    <div className="bg-[var(--surface-bg)] border border-[var(--border-warm)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 text-xs text-[var(--text-secondary)]">
        <span className="font-bold uppercase tracking-wider text-[var(--primary-green)]">
          Application Progress
        </span>
        {updatedAt && (
          <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
            <Clock className="w-3.5 h-3.5" />
            Updated {updatedAt}
          </span>
        )}
      </div>

      {isRejected ? (
        <div className="p-3 bg-red-950/30 border border-red-800 rounded-lg text-xs text-red-300 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          Application not moving forward for this position.
        </div>
      ) : (
        <div className="relative flex items-center justify-between py-2">
          {/* Grey connecting track */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[var(--border-warm)] -translate-y-1/2 z-0" />
          {/* Green filled progress */}
          <div
            className="absolute top-1/2 left-4 h-0.5 bg-[var(--primary-green)] -translate-y-1/2 transition-all duration-500 z-0"
            style={{ width: `${(currentIndex / (STAGES.length - 1)) * 90}%` }}
          />

          {STAGES.map((s, idx) => {
            const isDone = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={s.stage} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[var(--primary-dark)] text-[var(--text-inverse)] ring-4 ring-[var(--surface-subtle)]'
                      : isDone
                      ? 'bg-[var(--primary-green)] text-[var(--text-inverse)]'
                      : 'bg-[var(--surface-card)] text-[var(--text-tertiary)] border border-[var(--border-warm)]'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] mt-1.5 font-medium ${
                    isCurrent
                      ? 'text-[var(--primary-green)] font-bold'
                      : isDone
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-tertiary)]'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {notes && (
        <div className="mt-3 text-xs text-[var(--text-secondary)] bg-[var(--surface-card)] p-2.5 rounded-lg border border-[var(--border-warm)]">
          {notes}
        </div>
      )}
    </div>
  );
}
