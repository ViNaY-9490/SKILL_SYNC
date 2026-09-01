import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        _count: {
          select: { opportunities: true, industryProfiles: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        opportunities: {
          where: { status: 'PUBLISHED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        industryProfile: {
          include: {
            organization: true,
          },
        },
      },
    });

    return user?.industryProfile || null;
  }

  async updateProfile(userId: string, data: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { industryProfile: true },
    });

    if (!user?.industryProfile) {
      throw new NotFoundException('Industry profile not found');
    }

    return this.prisma.industryProfile.update({
      where: { id: user.industryProfile.id },
      data: {
        designation: data.designation,
        bio: data.bio,
        linkedinUrl: data.linkedinUrl,
      },
    });
  }

  async searchCandidates(skills?: string[], minReadinessScore = 0) {
    const whereClause: any = {};

    if (minReadinessScore > 0) {
      whereClause.placementReadinessScore = { gte: minReadinessScore };
    }

    if (skills && skills.length > 0) {
      whereClause.skills = {
        some: {
          skill: {
            name: { in: skills, mode: 'insensitive' },
          },
        },
      };
    }

    return this.prisma.studentProfile.findMany({
      where: whereClause,
      include: {
        skills: {
          include: { skill: true },
        },
        educations: true,
        projects: true,
      },
      take: 50,
      orderBy: { placementReadinessScore: 'desc' },
    });
  }
}
