import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus, UserRole } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Submit application for a student user
   */
  async apply(userId: string, opportunityId: string, coverNote?: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!student) {
      throw { message: 'Student profile not found' };
    }

    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    // Check existing
    const existing = await this.prisma.application.findUnique({
      where: {
        studentId_opportunityId: {
          studentId: student.id,
          opportunityId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('You have already applied for this opportunity');
    }

    // Calculate match score
    const matchResult = await this.computeMatchScore(student.id, opportunityId);

    const application = await this.prisma.application.create({
      data: {
        studentId: student.id,
        opportunityId,
        status: ApplicationStatus.APPLIED,
        coverLetter: coverNote,
        matchScore: matchResult.overallScore,
      },
      include: {
        opportunity: {
          include: {
            organization: true,
          },
        },
      },
    });

    return application;
  }

  /**
   * Get applications for the logged in student
   */
  async findByStudent(userId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!student) {
      return [];
    }

    return this.prisma.application.findMany({
      where: { studentId: student.id },
      include: {
        opportunity: {
          include: {
            organization: true,
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get applications for recruiter/industry user
   */
  async findByRecruiter(userId: string, opportunityId?: string, status?: ApplicationStatus) {
    const industryUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { industryProfile: true },
    });

    const orgId = industryUser?.industryProfile?.organizationId;

    const whereClause: any = {};
    if (orgId) {
      whereClause.opportunity = { organizationId: orgId };
    }
    if (opportunityId) {
      whereClause.opportunityId = opportunityId;
    }
    if (status) {
      whereClause.status = status;
    }

    return this.prisma.application.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
        opportunity: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update application status (Shortlist, Interview, Offer, Select, Reject)
   */
  async updateStatus(applicationId: string, status: ApplicationStatus, recruiterNotes?: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status,
        recruiterNotes,
        updatedAt: new Date(),
      },
      include: {
        student: true,
        opportunity: true,
      },
    });
  }

  /**
   * Helper to compute skill match score
   */
  private async computeMatchScore(studentId: string, opportunityId: string) {
    const reqSkills = await this.prisma.opportunitySkill.findMany({
      where: { opportunityId },
      include: { skill: true },
    });

    if (reqSkills.length === 0) {
      return { overallScore: 85, skillMatchPct: 85 };
    }

    const studentSkills = await this.prisma.studentSkill.findMany({
      where: { studentId },
    });

    const studentSkillMap = new Map(studentSkills.map((s) => [s.skillId, s]));
    let matched = 0;

    for (const req of reqSkills) {
      if (studentSkillMap.has(req.skillId)) {
        matched++;
      }
    }

    const matchPct = Math.round((matched / reqSkills.length) * 100);
    return {
      overallScore: Math.min(100, Math.max(50, matchPct)),
      skillMatchPct: matchPct,
    };
  }
}
