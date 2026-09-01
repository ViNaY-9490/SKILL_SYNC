import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstitutionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.institution.findMany({
      include: {
        departments: true,
        _count: { select: { enrollments: true, placementDrives: true } },
      },
    });
  }

  async findOne(id: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id },
      include: {
        departments: {
          include: { programs: true },
        },
        placementDrives: true,
      },
    });

    if (!institution) {
      throw new NotFoundException('Institution not found');
    }

    return institution;
  }

  async getStudents(userId: string) {
    // Return student profiles with enrollment details
    return this.prisma.studentProfile.findMany({
      include: {
        user: { select: { email: true, status: true } },
        skills: { include: { skill: true } },
        enrollments: { include: { institution: true, department: true, program: true } },
      },
      orderBy: { placementReadinessScore: 'desc' },
      take: 100,
    });
  }

  async getSkillMatrix() {
    const skills = await this.prisma.skill.findMany({
      take: 20,
      orderBy: { demandLevel: 'desc' },
      include: {
        _count: { select: { studentSkills: true, opportunitySkills: true } },
      },
    });

    return skills.map((s) => ({
      skill: s.name,
      demandLevel: s.demandLevel,
      studentCount: s._count.studentSkills,
      opportunityCount: s._count.opportunitySkills,
      gapIndex: Math.max(0, s._count.opportunitySkills * 10 - s._count.studentSkills * 2),
    }));
  }

  async getPlacementDriveStats() {
    return this.prisma.placementDrive.findMany({
      include: {
        institution: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
