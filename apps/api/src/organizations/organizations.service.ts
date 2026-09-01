import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEMO_ORGANIZATIONS = [
  { id: 'org_1', name: 'NovaStack Technologies', industry: 'Software Product', websiteUrl: 'https://novastack.demo', _count: { opportunities: 5, industryProfiles: 3 } },
  { id: 'org_2', name: 'BharatAI Labs', industry: 'Artificial Intelligence', websiteUrl: 'https://bharatai.demo', _count: { opportunities: 4, industryProfiles: 2 } },
  { id: 'org_3', name: 'CloudForge Innovations', industry: 'Cloud & DevOps', websiteUrl: 'https://cloudforge.demo', _count: { opportunities: 6, industryProfiles: 4 } },
];

const DEMO_CANDIDATES = [
  {
    id: 'std_cand_1',
    firstName: 'Vinay',
    lastName: 'Kumar Reddy',
    placementReadinessScore: 88,
    skills: [
      { skill: { name: 'Python' } },
      { skill: { name: 'SQL' } },
      { skill: { name: 'REST API' } },
    ],
    educations: [{ institution: 'VIT Bhopal', degree: 'B.Tech CSE', cgpa: 8.9 }],
    projects: [{ title: 'InventoryFlow Microservices', techStack: ['Python', 'FastAPI', 'Redis'] }],
  },
  {
    id: 'std_cand_2',
    firstName: 'Arjun',
    lastName: 'Sharma',
    placementReadinessScore: 82,
    skills: [
      { skill: { name: 'React' } },
      { skill: { name: 'TypeScript' } },
      { skill: { name: 'Node.js' } },
    ],
    educations: [{ institution: 'IIT Bombay', degree: 'B.Tech CSE', cgpa: 8.5 }],
    projects: [{ title: 'StudyBuddy Realtime Platform', techStack: ['React', 'TypeScript'] }],
  },
];

const DEMO_INDUSTRY_PROFILE = {
  id: 'ind_prof_1',
  designation: 'Tech Lead & Hiring Director',
  bio: 'Leading backend and cloud infrastructure hiring at NovaStack Technologies.',
  organization: DEMO_ORGANIZATIONS[0],
};

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.safeExecute(
      () =>
        this.prisma.organization.findMany({
          include: { _count: { select: { opportunities: true, industryProfiles: true } } },
          orderBy: { name: 'asc' },
        }),
      DEMO_ORGANIZATIONS as any,
    );
  }

  async findOne(id: string) {
    if (!this.prisma.isConnected) return DEMO_ORGANIZATIONS.find(o => o.id === id) || DEMO_ORGANIZATIONS[0];
    try {
      const org = await this.prisma.organization.findUnique({
        where: { id },
        include: { opportunities: { where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'desc' } } },
      });
      return org || DEMO_ORGANIZATIONS.find(o => o.id === id) || DEMO_ORGANIZATIONS[0];
    } catch {
      return DEMO_ORGANIZATIONS.find(o => o.id === id) || DEMO_ORGANIZATIONS[0];
    }
  }

  async getProfile(userId: string) {
    if (!this.prisma.isConnected) return DEMO_INDUSTRY_PROFILE;
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { industryProfile: { include: { organization: true } } },
      });
      return user?.industryProfile || DEMO_INDUSTRY_PROFILE;
    } catch {
      return DEMO_INDUSTRY_PROFILE;
    }
  }

  async updateProfile(userId: string, data: any) {
    if (!this.prisma.isConnected) return { ...DEMO_INDUSTRY_PROFILE, ...data };
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { industryProfile: true } });
      if (!user?.industryProfile) return { ...DEMO_INDUSTRY_PROFILE, ...data };

      return await this.prisma.industryProfile.update({
        where: { id: user.industryProfile.id },
        data: { designation: data.designation, bio: data.bio, linkedinUrl: data.linkedinUrl },
      });
    } catch {
      return { ...DEMO_INDUSTRY_PROFILE, ...data };
    }
  }

  async searchCandidates(skills?: string[], minReadinessScore = 0) {
    return this.prisma.safeExecute(
      () => {
        const whereClause: any = {};
        if (minReadinessScore > 0) whereClause.placementReadinessScore = { gte: minReadinessScore };
        if (skills && skills.length > 0) {
          whereClause.skills = { some: { skill: { name: { in: skills, mode: 'insensitive' } } } };
        }
        return this.prisma.studentProfile.findMany({
          where: whereClause,
          include: { skills: { include: { skill: true } }, educations: true, projects: true },
          take: 50,
          orderBy: { placementReadinessScore: 'desc' },
        });
      },
      DEMO_CANDIDATES as any,
    );
  }
}
