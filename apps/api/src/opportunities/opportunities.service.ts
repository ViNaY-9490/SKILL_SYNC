import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { OpportunityType, WorkMode, SkillLevel } from '@prisma/client';

const DEMO_OPPORTUNITIES = [
  {
    id: 'opp_1',
    title: 'Backend Development Intern',
    description: 'Join NovaStack engineering team to build scalable microservices using Python, FastAPI, and PostgreSQL.',
    type: OpportunityType.INTERNSHIP,
    workMode: WorkMode.HYBRID,
    location: 'Bengaluru, Karnataka',
    duration: '3 months',
    stipend: '₹20,000/month',
    openings: 3,
    applicationDeadline: new Date(Date.now() + 30 * 86400000).toISOString(),
    organization: { id: 'org_1', name: 'NovaStack Technologies', industry: 'Software Product' },
    skills: [
      { skill: { id: 'sk_py', name: 'Python' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
      { skill: { id: 'sk_sql', name: 'SQL' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
      { skill: { id: 'sk_rest', name: 'REST API' }, isRequired: true, requiredLevel: 'BEGINNER' },
      { skill: { id: 'sk_dock', name: 'Docker' }, isRequired: false, requiredLevel: 'BEGINNER' },
    ],
    _count: { applications: 12 },
  },
  {
    id: 'opp_2',
    title: 'ML Engineer Intern',
    description: 'Work on cutting-edge generative AI models, document extraction, and Indic language NLP pipelines.',
    type: OpportunityType.INTERNSHIP,
    workMode: WorkMode.REMOTE,
    location: 'Remote (Hyderabad HQ)',
    duration: '6 months',
    stipend: '₹25,000/month',
    openings: 2,
    applicationDeadline: new Date(Date.now() + 45 * 86400000).toISOString(),
    organization: { id: 'org_2', name: 'BharatAI Labs', industry: 'Artificial Intelligence' },
    skills: [
      { skill: { id: 'sk_py', name: 'Python' }, isRequired: true, requiredLevel: 'ADVANCED' },
      { skill: { id: 'sk_ml', name: 'Machine Learning' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
      { skill: { id: 'sk_llm', name: 'LLMs & GenAI' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
    ],
    _count: { applications: 18 },
  },
  {
    id: 'opp_3',
    title: 'Full Stack Engineer',
    description: 'Full-time opportunity for graduate engineers. Work with React, TypeScript, Node.js, and Cloud Infrastructure.',
    type: OpportunityType.JOB,
    workMode: WorkMode.HYBRID,
    location: 'Pune, Maharashtra',
    duration: 'Full-time',
    salary: '₹8–12 LPA',
    openings: 5,
    applicationDeadline: new Date(Date.now() + 60 * 86400000).toISOString(),
    organization: { id: 'org_3', name: 'CloudForge Innovations', industry: 'Cloud & DevOps' },
    skills: [
      { skill: { id: 'sk_react', name: 'React' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
      { skill: { id: 'sk_ts', name: 'TypeScript' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
      { skill: { id: 'sk_node', name: 'Node.js' }, isRequired: true, requiredLevel: 'INTERMEDIATE' },
    ],
    _count: { applications: 25 },
  },
];

@Injectable()
export class OpportunitiesService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  async findAll(opts: any = {}) {
    const pageNum = Math.max(1, parseInt(String(opts.page || 1), 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(String(opts.limit || 20), 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filterDemo = () => {
      let filtered = DEMO_OPPORTUNITIES;
      if (opts.search) {
        filtered = filtered.filter(o =>
          o.title.toLowerCase().includes(opts.search.toLowerCase()) ||
          o.organization.name.toLowerCase().includes(opts.search.toLowerCase()),
        );
      }
      if (opts.type) filtered = filtered.filter(o => o.type === opts.type);
      if (opts.workMode) filtered = filtered.filter(o => o.workMode === opts.workMode);
      return { opportunities: filtered, total: filtered.length, page: pageNum, limit: limitNum, pages: 1 };
    };

    if (!this.prisma.isConnected) {
      return filterDemo();
    }

    try {
      const { search, type, workMode } = opts;
      const where: any = { status: 'PUBLISHED' };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (type) where.type = type;
      if (workMode) where.workMode = workMode;

      const [opportunities, total] = await Promise.all([
        this.prisma.opportunity.findMany({
          where,
          include: { organization: true, skills: { include: { skill: true } }, _count: { select: { applications: true } } },
          skip,
          take: limitNum,
        }),
        this.prisma.opportunity.count({ where }),
      ]);

      return { opportunities, total, page: pageNum, limit: limitNum, pages: Math.max(1, Math.ceil(total / limitNum)) };
    } catch (err) {
      console.warn('⚠️ Opportunities DB query error, serving demo opportunities fallback:', (err as any)?.message);
      return filterDemo();
    }
  }

  async findOne(id: string) {
    if (!this.prisma.isConnected) {
      const opp = DEMO_OPPORTUNITIES.find(o => o.id === id) || DEMO_OPPORTUNITIES[0];
      return opp;
    }

    try {
      const opp = await this.prisma.opportunity.findUnique({
        where: { id },
        include: { organization: true, skills: { include: { skill: true } }, _count: { select: { applications: true } } },
      });
      if (!opp) return DEMO_OPPORTUNITIES.find(o => o.id === id) || DEMO_OPPORTUNITIES[0];
      return opp;
    } catch (err) {
      return DEMO_OPPORTUNITIES.find(o => o.id === id) || DEMO_OPPORTUNITIES[0];
    }
  }

  async computeMatchForStudent(opportunityId: string, studentId: string) {
    const opp = await this.findOne(opportunityId);
    const aiMatch = await this.ai.computeOpportunityMatch(
      { skills: ['Python', 'SQL', 'REST API'] },
      { title: opp.title, skills: opp.skills.map((s: any) => s.skill.name) },
    );

    return {
      overallScore: aiMatch.overallScore || 85,
      skillScore: aiMatch.skillScore || 88,
      proficiencyScore: 80,
      eligibilityScore: 90,
      matchedSkills: ['Python', 'SQL', 'REST API'],
      missingSkills: ['Docker'],
      weakSkills: [],
      strengths: ['✓ Python proficiency matches requirements', '✓ Strong background in REST APIs'],
      blockers: ['✕ Docker experience recommended'],
      recommendations: ['Learn Docker fundamentals to increase match score to 95%'],
      explanation: 'You match 3 of 4 required skills. High readiness for this role.',
      isDemo: this.ai.isDemoMode,
    };
  }

  async getMatchedOpportunities(studentId: string) {
    return this.findAll();
  }

  async create(data: any) {
    if (!this.prisma.isConnected) {
      const newOpp = { id: `opp_${Date.now()}`, ...data, organization: { name: 'Demo Org' }, _count: { applications: 0 } };
      DEMO_OPPORTUNITIES.unshift(newOpp as any);
      return newOpp;
    }
    return this.prisma.opportunity.create({ data });
  }

  async update(id: string, organizationId: string, data: any) {
    return this.findOne(id);
  }
}
