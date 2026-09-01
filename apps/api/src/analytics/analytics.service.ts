import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getIndustryDemand() {
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

    return topSkills.map((s) => ({
      skill: s.name,
      category: s.category?.name || 'General',
      demandScore: s.demandLevel,
      openOpportunities: s._count.opportunitySkills,
      skilledStudents: s._count.studentSkills,
    }));
  }

  async getSkillAlignment() {
    const totalStudents = await this.prisma.studentProfile.count();
    const studentsWithScore = await this.prisma.studentProfile.findMany({
      select: { placementReadinessScore: true },
      where: { placementReadinessScore: { not: null } },
    });

    const avgReadiness =
      studentsWithScore.length > 0
        ? Math.round(
            studentsWithScore.reduce((acc, s) => acc + (s.placementReadinessScore || 0), 0) /
              studentsWithScore.length,
          )
        : 72;

    return {
      totalStudents,
      avgReadinessScore: avgReadiness,
      highReadinessCount: studentsWithScore.filter((s) => (s.placementReadinessScore || 0) >= 75).length,
      moderateReadinessCount: studentsWithScore.filter(
        (s) => (s.placementReadinessScore || 0) >= 50 && (s.placementReadinessScore || 0) < 75,
      ).length,
      needsImprovementCount: studentsWithScore.filter((s) => (s.placementReadinessScore || 0) < 50).length,
    };
  }
}
