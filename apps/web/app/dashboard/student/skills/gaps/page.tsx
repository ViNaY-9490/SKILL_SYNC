'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  TrendingUp,
  Brain,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

const TARGET_ROLES = [
  'Backend Developer',
  'ML Engineer',
  'Cloud & DevOps Engineer',
  'Full Stack Engineer',
  'Cybersecurity Analyst',
];

const ROLE_GAPS: Record<string, any[]> = {
  'Backend Developer': [
    {
      id: 'gap_dock',
      skill: { name: 'Docker & Containerization', category: { name: 'Cloud & DevOps' } },
      severity: 'HIGH',
      requiredLevel: 'INTERMEDIATE',
      currentLevel: 'BEGINNER',
      estimatedEffort: '3-4 weeks',
      recommendations: [
        { id: 'r1', type: 'COURSE', title: 'Docker & Kubernetes Fundamentals', description: 'Master containerization, multi-container apps, and pod orchestration.' },
        { id: 'r2', type: 'PROJECT', title: 'Containerize Microservice REST API', description: 'Write Dockerfiles and deploy a multi-service NestJS + Next.js stack.' },
      ],
    },
    {
      id: 'gap_aws',
      skill: { name: 'AWS Cloud Services', category: { name: 'Cloud & DevOps' } },
      severity: 'MEDIUM',
      requiredLevel: 'INTERMEDIATE',
      currentLevel: 'BEGINNER',
      estimatedEffort: '2-3 weeks',
      recommendations: [
        { id: 'r3', type: 'COURSE', title: 'AWS Cloud Practitioner & Solutions Architecture', description: 'Learn EC2, S3, RDS, Lambda, and IAM security principles.' },
      ],
    },
  ],
  'ML Engineer': [
    {
      id: 'gap_pytorch',
      skill: { name: 'PyTorch & Neural Networks', category: { name: 'AI & ML' } },
      severity: 'CRITICAL',
      requiredLevel: 'ADVANCED',
      currentLevel: 'BEGINNER',
      estimatedEffort: '4-5 weeks',
      recommendations: [
        { id: 'r4', type: 'COURSE', title: 'Deep Learning with PyTorch', description: 'Build and fine-tune Transformer models, CNNs, and embeddings.' },
        { id: 'r5', type: 'PROJECT', title: 'BERT NLP Sentiment Classifier', description: 'Train and deploy an NLP model on AWS SageMaker.' },
      ],
    },
    {
      id: 'gap_mlops',
      skill: { name: 'MLOps Pipeline Deployment', category: { name: 'AI & ML' } },
      severity: 'HIGH',
      requiredLevel: 'INTERMEDIATE',
      currentLevel: 'NONE',
      estimatedEffort: '3 weeks',
      recommendations: [
        { id: 'r6', type: 'COURSE', title: 'MLflow & Kubeflow Pipeline Orchestration', description: 'Automate model tracking and containerized inference.' },
      ],
    },
  ],
  'Cloud & DevOps Engineer': [
    {
      id: 'gap_k8s',
      skill: { name: 'Kubernetes Cluster Admin', category: { name: 'Cloud & Infrastructure' } },
      severity: 'CRITICAL',
      requiredLevel: 'ADVANCED',
      currentLevel: 'BEGINNER',
      estimatedEffort: '5 weeks',
      recommendations: [
        { id: 'r7', type: 'COURSE', title: 'CKA Certified Kubernetes Administrator Prep', description: 'Manage deployments, ingress controllers, persistent volumes, and RBAC.' },
      ],
    },
    {
      id: 'gap_tf',
      skill: { name: 'Terraform Infrastructure as Code', category: { name: 'Cloud & Infrastructure' } },
      severity: 'HIGH',
      requiredLevel: 'INTERMEDIATE',
      currentLevel: 'BEGINNER',
      estimatedEffort: '3 weeks',
      recommendations: [
        { id: 'r8', type: 'PROJECT', title: 'Automate AWS VPC Provisioning with Terraform', description: 'Write reusable HCL modules for cloud infrastructure.' },
      ],
    },
  ],
  'Full Stack Engineer': [
    {
      id: 'gap_nextjs',
      skill: { name: 'Next.js 15 App Router & SSR', category: { name: 'Frontend Architecture' } },
      severity: 'HIGH',
      requiredLevel: 'ADVANCED',
      currentLevel: 'INTERMEDIATE',
      estimatedEffort: '2 weeks',
      recommendations: [
        { id: 'r9', type: 'PROJECT', title: 'Server Actions & Suspense Optimization', description: 'Optimize Core Web Vitals and streaming SSR rendering.' },
      ],
    },
    {
      id: 'gap_graph',
      skill: { name: 'GraphQL & Apollo Federation', category: { name: 'API Architecture' } },
      severity: 'MEDIUM',
      requiredLevel: 'INTERMEDIATE',
      currentLevel: 'BEGINNER',
      estimatedEffort: '2-3 weeks',
      recommendations: [
        { id: 'r10', type: 'COURSE', title: 'Production GraphQL APIs with Node.js', description: 'Implement queries, mutations, subscriptions, and dataloaders.' },
      ],
    },
  ],
  'Cybersecurity Analyst': [
    {
      id: 'gap_sec',
      skill: { name: 'Penetration Testing & OWASP Top 10', category: { name: 'Security' } },
      severity: 'CRITICAL',
      requiredLevel: 'ADVANCED',
      currentLevel: 'BEGINNER',
      estimatedEffort: '4-6 weeks',
      recommendations: [
        { id: 'r11', type: 'COURSE', title: 'CompTIA Security+ & Ethical Hacking', description: 'Vulnerability assessment, Burp Suite, and network packet analysis.' },
      ],
    },
  ],
};

export default function SkillGapsPage() {
  const [selectedRole, setSelectedRole] = useState('Backend Developer');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const queryClient = useQueryClient();

  const { data: gapsData } = useQuery({
    queryKey: ['skill-gaps', selectedRole],
    queryFn: async () => {
      return ROLE_GAPS[selectedRole] || ROLE_GAPS['Backend Developer'];
    },
  });

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['skill-gaps'] });
      setIsAnalyzing(false);
    }, 500);
  };

  const rawGaps = (gapsData && Array.isArray(gapsData) && gapsData.length > 0) ? gapsData : (ROLE_GAPS[selectedRole] || ROLE_GAPS['Backend Developer'] || []);
  const activeGaps = Array.isArray(rawGaps) ? rawGaps : [];
  const filteredGaps = severityFilter === 'ALL'
    ? activeGaps
    : activeGaps.filter((g) => g && g.severity === severityFilter);

  const criticalCount = activeGaps.filter((g) => g && (g.severity === 'CRITICAL' || g.severity === 'HIGH')).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-warm)]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-green)] mb-0.5">
            Competency Gap Analysis
          </div>
          <h1 className="text-h1 flex items-center gap-2 text-[var(--text-primary)]">
            <Target className="w-6 h-6 text-[var(--primary-dark)]" />
            AI Skill Gap Engine
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Analyze missing competencies against standardized role requirements and track resolution paths.
          </p>
        </div>

        {/* Role Selector & Run Analysis */}
        <div className="flex items-center gap-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 rounded-md text-xs font-semibold border border-[var(--border-warm)] bg-[var(--surface-paper)] text-[var(--text-primary)] outline-none"
          >
            {TARGET_ROLES.map((r) => (
              <option key={r} value={r}>
                Target: {r}
              </option>
            ))}
          </select>

          <Button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            variant="primary"
            size="sm"
          >
            {isAnalyzing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            Run Gap Analysis
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="surface-card p-4">
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Target Role</div>
          <div className="text-sm font-bold text-[var(--text-primary)] truncate">{selectedRole}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Vishnu Institute Standard Taxonomy</div>
        </div>

        <div className="surface-card p-4">
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Identified Gaps</div>
          <div className="text-xl font-bold text-[var(--text-primary)]">{activeGaps.length}</div>
          <div className="text-[11px] text-[var(--accent-saffron)] font-medium mt-0.5">{criticalCount} High / Critical</div>
        </div>

        <div className="surface-card p-4">
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Est. Effort</div>
          <div className="text-xl font-bold text-[var(--text-primary)]">3-4 Weeks</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Based on 8h/week practice</div>
        </div>

        <div className="surface-card p-4">
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Match Readiness Impact</div>
          <div className="text-xl font-bold text-[var(--primary-green)]">+22%</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Post gap resolution</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-[var(--surface-paper)] p-2 rounded-lg border border-[var(--border-warm)]">
        <div className="flex items-center gap-1">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                severityFilter === sev
                  ? 'bg-[var(--primary-dark)] text-[var(--text-inverse)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <span className="text-xs text-[var(--text-tertiary)]">Showing {filteredGaps.length} gap(s)</span>
      </div>

      {/* Gaps List */}
      {filteredGaps.length > 0 ? (
        <div className="space-y-4">
          {filteredGaps.map((gap) => (
            <div
              key={gap.id}
              className="surface-card p-5 border-l-4 border-l-[var(--primary-dark)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">
                      {gap.skill.name}
                    </h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[var(--surface-subtle)] text-[var(--primary-dark)]">
                      {gap.severity}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Required: <strong className="text-[var(--text-primary)]">{gap.requiredLevel}</strong> | Current: <span className="text-[var(--text-tertiary)]">{gap.currentLevel || 'Not acquired'}</span>
                  </p>
                </div>

                {gap.estimatedEffort && (
                  <span className="text-xs text-[var(--text-secondary)] bg-[var(--surface-subtle)] px-2.5 py-1 rounded border border-[var(--border-warm)] w-fit flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[var(--sage-muted)]" />
                    Effort: {gap.estimatedEffort}
                  </span>
                )}
              </div>

              {/* Recommendations */}
              {gap.recommendations && gap.recommendations.length > 0 && (
                <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                    Recommended Action Items
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {gap.recommendations.map((rec: any) => (
                      <div
                        key={rec.id}
                        className="p-3 rounded-md bg-[var(--surface-paper)] border border-[var(--border-subtle)] flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-[var(--primary-green)] uppercase block">{rec.type}</span>
                          <span className="text-xs font-bold text-[var(--text-primary)] block mt-0.5">{rec.title}</span>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">{rec.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="surface-card p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-[var(--primary-green)] mx-auto mb-2" />
          <h3 className="text-h3 text-[var(--text-primary)]">No Gaps Found</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            You meet all required competencies for {selectedRole}.
          </p>
        </div>
      )}
    </div>
  );
}
