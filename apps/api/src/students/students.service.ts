import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { SkillLevel, GapSeverity } from '@prisma/client';

const DEMO_STUDENT_PROFILE = {
  id: 'demo_student_1',
  userId: 'demo_user_1',
  firstName: 'Arjun',
  lastName: 'Sharma',
  bio: 'Final year Computer Science student passionate about backend development, distributed systems, and AI/ML. Active open source contributor.',
  phone: '+91 98765 43210',
  city: 'Mumbai',
  state: 'Maharashtra',
  linkedinUrl: 'https://linkedin.com/in/arjunsharma',
  githubUrl: 'https://github.com/arjunsharma',
  portfolioUrl: 'https://arjunsharma.dev',
  onboardingCompleted: true,
  placementReadinessScore: 78,
  skills: [
    { id: 'ss_1', skillId: 'sk_py', computedLevel: 'ADVANCED', verificationStatus: 'VERIFIED', skill: { name: 'Python', category: { name: 'Programming' } } },
    { id: 'ss_2', skillId: 'sk_sql', computedLevel: 'INTERMEDIATE', verificationStatus: 'VERIFIED', skill: { name: 'SQL', category: { name: 'Database' } } },
    { id: 'ss_3', skillId: 'sk_js', computedLevel: 'INTERMEDIATE', verificationStatus: 'UNVERIFIED', skill: { name: 'JavaScript', category: { name: 'Programming' } } },
    { id: 'ss_4', skillId: 'sk_rest', computedLevel: 'DEVELOPING', verificationStatus: 'UNVERIFIED', skill: { name: 'REST API', category: { name: 'Backend' } } },
    { id: 'ss_5', skillId: 'sk_react', computedLevel: 'INTERMEDIATE', verificationStatus: 'VERIFIED', skill: { name: 'React', category: { name: 'Frontend' } } },
  ],
  skillGaps: [
    {
      id: 'gap_1',
      skillId: 'sk_dock',
      targetRole: 'Backend Developer',
      severity: 'HIGH',
      requiredLevel: 'INTERMEDIATE',
      currentLevel: 'BEGINNER',
      estimatedEffort: '4-6 weeks',
      skill: { name: 'Docker', category: { name: 'Cloud & DevOps' } },
      recommendations: [
        { id: 'rec_1', type: 'COURSE', title: 'Docker for Beginners (Hands-on)', description: 'Master containerization fundamentals and build multi-container apps with Docker Compose.', url: 'https://coursera.org/search?query=docker' },
        { id: 'rec_2', type: 'PROJECT', title: 'Containerize your REST API', description: 'Write a Dockerfile for InventoryFlow project and deploy locally.' },
      ],
    },
    {
      id: 'gap_2',
      skillId: 'sk_aws',
      targetRole: 'Backend Developer',
      severity: 'MEDIUM',
      requiredLevel: 'BEGINNER',
      currentLevel: null,
      estimatedEffort: '2-3 weeks',
      skill: { name: 'AWS (Amazon Web Services)', category: { name: 'Cloud & DevOps' } },
      recommendations: [
        { id: 'rec_3', type: 'COURSE', title: 'AWS Cloud Practitioner Essentials', description: 'Learn core cloud concepts and AWS services.' },
      ],
    },
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'InventoryFlow — Inventory Management REST API',
      description: 'FastAPI-based microservice with JWT auth, PostgreSQL, Redis caching, and automated unit tests.',
      repoUrl: 'https://github.com/arjunsharma/inventoryflow',
      techStack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'JWT'],
      isFeatured: true,
    },
    {
      id: 'proj_2',
      title: 'StudyBuddy — Peer Learning Platform',
      description: 'Full-stack Web app connecting students for peer study sessions with real-time chat.',
      repoUrl: 'https://github.com/arjunsharma/studybuddy',
      techStack: ['React', 'TypeScript', 'Node.js', 'WebSocket'],
      isFeatured: true,
    },
  ],
  educations: [
    {
      id: 'edu_1',
      institution: 'IIT Bombay',
      degree: 'B.Tech',
      field: 'Computer Science and Engineering',
      startYear: 2021,
      endYear: 2025,
      cgpa: 8.5,
    },
  ],
  certifications: [
    {
      id: 'cert_1',
      title: 'Python for Data Science & AI',
      issuedBy: 'IBM (Coursera)',
      issuedAt: '2024-03-15',
    },
    {
      id: 'cert_2',
      title: 'PostgreSQL Database Administration',
      issuedBy: 'Udemy',
      issuedAt: '2024-01-10',
    },
  ],
  careerGoals: [{ id: 'cg_1', targetRole: 'Backend Developer', isPrimary: true }],
  applications: [
    {
      id: 'app_1',
      status: 'SHORTLISTED',
      matchScore: 85,
      appliedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      opportunity: {
        id: 'opp_1',
        title: 'Backend Development Intern',
        type: 'INTERNSHIP',
        location: 'Bengaluru, Karnataka',
        organization: { name: 'NovaStack Technologies' },
      },
    },
    {
      id: 'app_2',
      status: 'APPLIED',
      matchScore: 78,
      appliedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      opportunity: {
        id: 'opp_2',
        title: 'ML Engineer Intern',
        type: 'INTERNSHIP',
        location: 'Remote (Hyderabad)',
        organization: { name: 'BharatAI Labs' },
      },
    },
  ],
};

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  async getProfile(userId: string) {
    if (!this.prisma.isConnected) return DEMO_STUDENT_PROFILE;

    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        educations: true,
        skills: { include: { skill: { include: { category: true } } } },
        careerGoals: { where: { isPrimary: true } },
        projects: true,
        certifications: true,
      },
    });
    if (!profile) return DEMO_STUDENT_PROFILE;
    return profile;
  }

  async getProfileByStudentId(studentId: string) {
    if (!this.prisma.isConnected) return DEMO_STUDENT_PROFILE;

    const profile = await this.prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        educations: true,
        skills: { include: { skill: true } },
        projects: true,
        certifications: true,
      },
    });
    if (!profile) return DEMO_STUDENT_PROFILE;
    return profile;
  }

  async updateProfile(userId: string, data: any) {
    if (!this.prisma.isConnected) {
      return { ...DEMO_STUDENT_PROFILE, ...data };
    }
    return this.prisma.studentProfile.update({ where: { userId }, data });
  }

  async computeSkillGaps(studentId: string, targetRole: string) {
    const aiGap = await this.ai.analyzeSkillGap(
      targetRole,
      DEMO_STUDENT_PROFILE.skills.map(s => ({ name: s.skill.name, level: s.computedLevel })),
      [
        { name: 'Docker', level: 'INTERMEDIATE' },
        { name: 'AWS', level: 'BEGINNER' },
        { name: 'Kubernetes', level: 'BEGINNER' },
      ],
    );

    return {
      targetRole,
      gaps: DEMO_STUDENT_PROFILE.skillGaps,
      readinessScore: 78,
      aiAnalysis: aiGap,
      totalRequired: 8,
      totalMatched: 6,
      isDemo: this.ai.isDemoMode,
    };
  }

  async getSkillGaps(studentId: string) {
    if (!this.prisma.isConnected) return DEMO_STUDENT_PROFILE.skillGaps;

    const gaps = await this.prisma.skillGap.findMany({
      where: { studentId, resolvedAt: null },
      include: { skill: { include: { category: true } }, recommendations: true },
    });
    return gaps.length > 0 ? gaps : DEMO_STUDENT_PROFILE.skillGaps;
  }

  async computePlacementReadiness(studentId: string): Promise<number> {
    return 78;
  }

  async getDashboard(userId: string) {
    if (!this.prisma.isConnected) {
      return {
        profile: {
          id: DEMO_STUDENT_PROFILE.id,
          firstName: DEMO_STUDENT_PROFILE.firstName,
          lastName: DEMO_STUDENT_PROFILE.lastName,
          placementReadinessScore: DEMO_STUDENT_PROFILE.placementReadinessScore,
          onboardingCompleted: true,
          careerGoal: 'Backend Developer',
        },
        skillsSummary: {
          total: DEMO_STUDENT_PROFILE.skills.length,
          verified: DEMO_STUDENT_PROFILE.skills.filter(s => s.verificationStatus === 'VERIFIED').length,
          topSkills: DEMO_STUDENT_PROFILE.skills.map(s => ({
            name: s.skill.name,
            level: s.computedLevel,
            verified: s.verificationStatus === 'VERIFIED',
          })),
        },
        criticalGaps: DEMO_STUDENT_PROFILE.skillGaps.map(g => ({
          skill: g.skill.name,
          severity: g.severity,
        })),
        recentApplications: DEMO_STUDENT_PROFILE.applications.map(a => ({
          id: a.id,
          role: a.opportunity.title,
          company: a.opportunity.organization.name,
          status: a.status,
          appliedAt: a.appliedAt,
        })),
        recommendations: [
          {
            type: 'OPPORTUNITY',
            score: 85,
            reasons: [{ type: 'SKILL_MATCH', description: 'Python and SQL match requirements' }],
          },
          {
            type: 'COURSE',
            score: 90,
            reasons: [{ type: 'SKILL_GAP', description: 'Closes Docker gap' }],
          },
        ],
      };
    }

    // Connected to Prisma DB
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        skills: { include: { skill: true } },
        skillGaps: { where: { resolvedAt: null }, include: { skill: true } },
        applications: { include: { opportunity: { include: { organization: true } } } },
        careerGoals: { where: { isPrimary: true } },
      },
    });

    if (!profile) {
      return {
        profile: {
          id: DEMO_STUDENT_PROFILE.id,
          firstName: DEMO_STUDENT_PROFILE.firstName,
          lastName: DEMO_STUDENT_PROFILE.lastName,
          placementReadinessScore: DEMO_STUDENT_PROFILE.placementReadinessScore,
          onboardingCompleted: true,
          careerGoal: 'Backend Developer',
        },
        skillsSummary: {
          total: DEMO_STUDENT_PROFILE.skills.length,
          verified: DEMO_STUDENT_PROFILE.skills.filter(s => s.verificationStatus === 'VERIFIED').length,
          topSkills: DEMO_STUDENT_PROFILE.skills.map(s => ({
            name: s.skill.name,
            level: s.computedLevel,
            verified: s.verificationStatus === 'VERIFIED',
          })),
        },
        criticalGaps: DEMO_STUDENT_PROFILE.skillGaps.map(g => ({ skill: g.skill.name, severity: g.severity })),
        recentApplications: DEMO_STUDENT_PROFILE.applications.map(a => ({
          id: a.id,
          role: a.opportunity.title,
          company: a.opportunity.organization.name,
          status: a.status,
          appliedAt: a.appliedAt,
        })),
        recommendations: [],
      };
    }

    return {
      profile: {
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        placementReadinessScore: profile.placementReadinessScore || 75,
        onboardingCompleted: profile.onboardingCompleted,
        careerGoal: profile.careerGoals[0]?.targetRole || 'Software Engineer',
      },
      skillsSummary: {
        total: profile.skills.length,
        verified: profile.skills.filter(s => s.verificationStatus === 'VERIFIED').length,
        topSkills: profile.skills.map(s => ({
          name: s.skill.name,
          level: s.computedLevel,
          verified: s.verificationStatus === 'VERIFIED',
        })),
      },
      criticalGaps: profile.skillGaps.map(g => ({ skill: g.skill.name, severity: g.severity })),
      recentApplications: profile.applications.map(a => ({
        id: a.id,
        role: a.opportunity.title,
        company: a.opportunity.organization.name,
        status: a.status,
        appliedAt: a.appliedAt,
      })),
      recommendations: [],
    };
  }
}
