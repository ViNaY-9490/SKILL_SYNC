import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatus, UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers(role?: UserRole, status?: UserStatus, search?: string) {
    const whereClause: any = {};
    if (role) whereClause.role = role;
    if (status) whereClause.status = status;
    if (search) {
      whereClause.email = { contains: search, mode: 'insensitive' };
    }

    return this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        studentProfile: { select: { firstName: true, lastName: true, placementReadinessScore: true } },
        industryProfile: { select: { designation: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { status },
      select: { id: true, email: true, role: true, status: true },
    });
  }

  async getAuditLogs(action?: string) {
    const whereClause: any = {};
    if (action) whereClause.action = action as any;

    return this.prisma.auditLog.findMany({
      where: whereClause,
      include: {
        actor: { select: { email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async getPlatformStats() {
    const [
      totalUsers,
      totalStudents,
      totalIndustry,
      totalOpportunities,
      totalApplications,
      totalAssessments,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.STUDENT } }),
      this.prisma.user.count({ where: { role: UserRole.INDUSTRY } }),
      this.prisma.opportunity.count(),
      this.prisma.application.count(),
      this.prisma.assessment.count(),
    ]);

    return {
      totalUsers,
      totalStudents,
      totalIndustry,
      totalOpportunities,
      totalApplications,
      totalAssessments,
    };
  }
}
