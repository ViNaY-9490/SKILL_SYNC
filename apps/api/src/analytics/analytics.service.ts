import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEMO_INDUSTRY_DEMAND = [
  { skill: 'Python', category: 'Programming', demandScore: 95, openOpportunities: 18, skilledStudents: 42 },
  { skill: 'Docker', category: 'Cloud & DevOps', demandScore: 92, openOpportunities: 22, skilledStudents: 12 },
  { skill: 'SQL', category: 'Databases', demandScore: 90, openOpportunities: 20, skilledStudents: 45 },
  { skill: 'React', category: 'Frontend Development', demandScore: 92, openOpportunities: 15, skilledStudents: 38 },
  { skill: 'Machine Learning', category: 'AI / ML', demandScore: 90, openOpportunities: 12, skilledStudents: 15 },
];

const DEMO_ALIGNMENT = {
  totalStudents: 125,
  avgReadinessScore: 78,
  highReadinessCount: 54,
  moderateReadinessCount: 51,
  needsImprovementCount: 20,
};

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getIndustryDemand() {
    return this.prisma.safeExecute(
      async () => {
        const topSkills = await this.prisma.skill.findMany({
          take: 10,
          orderBy: { demandLevel: 'desc' },
          select: {
            id: true,
            name: true,
            slug: true,
            demandLevel: true,
            category: { select: { name: true } },
            _count: { select: { opportunitySkills: true, studentSkills: true } },
          },
        });
        if (topSkills.length === 0) return DEMO_INDUSTRY_DEMAND;
        return topSkills.map((s) => ({
          skill: s.name,
          category: s.category?.name || 'General',
          demandScore: s.demandLevel,
          openOpportunities: s._count.opportunitySkills,
          skilledStudents: s._count.studentSkills,
        }));
      },
      DEMO_INDUSTRY_DEMAND,
    );
  }

  async getSkillAlignment() {
    return this.prisma.safeExecute(
      async () => {
        const totalStudents = await this.prisma.studentProfile.count();
        const studentsWithScore = await this.prisma.studentProfile.findMany({
          select: { placementReadinessScore: true },
          where: { placementReadinessScore: { not: null } },
        });

        if (totalStudents === 0) return DEMO_ALIGNMENT;

        const avgReadiness =
          studentsWithScore.length > 0
            ? Math.round(
                studentsWithScore.reduce((acc, s) => acc + (s.placementReadinessScore || 0), 0) /
                  studentsWithScore.length,
              )
            : 78;

        return {
          totalStudents,
          avgReadinessScore: avgReadiness,
          highReadinessCount: studentsWithScore.filter((s) => (s.placementReadinessScore || 0) >= 75).length,
          moderateReadinessCount: studentsWithScore.filter(
            (s) => (s.placementReadinessScore || 0) >= 50 && (s.placementReadinessScore || 0) < 75,
          ).length,
          needsImprovementCount: studentsWithScore.filter((s) => (s.placementReadinessScore || 0) < 50).length,
        };
      },
      DEMO_ALIGNMENT,
    );
  }
}
