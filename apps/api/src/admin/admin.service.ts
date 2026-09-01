import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatus, UserRole } from '@prisma/client';

const DEMO_USERS = [
  { id: 'demo_student_1', email: 'student@skillsync.local', role: UserRole.STUDENT, status: UserStatus.ACTIVE, createdAt: new Date().toISOString(), lastLoginAt: new Date().toISOString(), studentProfile: { firstName: 'Vinay', lastName: 'Kumar Reddy', placementReadinessScore: 88 } },
  { id: 'demo_recruiter_1', email: 'industry@skillsync.local', role: UserRole.INDUSTRY, status: UserStatus.ACTIVE, createdAt: new Date().toISOString(), lastLoginAt: new Date().toISOString(), industryProfile: { designation: 'Tech Lead Recruiter' } },
  { id: 'demo_faculty_1', email: 'faculty@skillsync.local', role: UserRole.FACULTY, status: UserStatus.ACTIVE, createdAt: new Date().toISOString(), lastLoginAt: new Date().toISOString() },
  { id: 'demo_inst_1', email: 'institution@skillsync.local', role: UserRole.INSTITUTION_ADMIN, status: UserStatus.ACTIVE, createdAt: new Date().toISOString(), lastLoginAt: new Date().toISOString() },
  { id: 'demo_admin_1', email: 'admin@skillsync.local', role: UserRole.SUPER_ADMIN, status: UserStatus.ACTIVE, createdAt: new Date().toISOString(), lastLoginAt: new Date().toISOString() },
];

const DEMO_AUDIT_LOGS = [
  { id: 'log_1', action: 'USER_LOGIN', actor: { email: 'student@skillsync.local', role: 'STUDENT' }, createdAt: new Date().toISOString() },
  { id: 'log_2', action: 'OPPORTUNITY_CREATED', actor: { email: 'industry@skillsync.local', role: 'INDUSTRY' }, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'log_3', action: 'ASSESSMENT_COMPLETED', actor: { email: 'student@skillsync.local', role: 'STUDENT' }, createdAt: new Date(Date.now() - 7200000).toISOString() },
];

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers(role?: UserRole, status?: UserStatus, search?: string) {
    let filtered = DEMO_USERS;
    if (role) filtered = filtered.filter(u => u.role === role);
    if (status) filtered = filtered.filter(u => u.status === status);
    if (search) filtered = filtered.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));

    return this.prisma.safeExecute(
      () => {
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
      },
      filtered as any,
    );
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    if (!this.prisma.isConnected) {
      return { id: userId, email: 'user@demo.local', role: UserRole.STUDENT, status };
    }
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return { id: userId, email: 'user@demo.local', role: UserRole.STUDENT, status };
      }
      return await this.prisma.user.update({
        where: { id: userId },
        data: { status },
        select: { id: true, email: true, role: true, status: true },
      });
    } catch {
      return { id: userId, email: 'user@demo.local', role: UserRole.STUDENT, status };
    }
  }

  async getAuditLogs(action?: string) {
    return this.prisma.safeExecute(
      () => {
        const whereClause: any = {};
        if (action) whereClause.action = action as any;
        return this.prisma.auditLog.findMany({
          where: whereClause,
          include: { actor: { select: { email: true, role: true } } },
          orderBy: { createdAt: 'desc' },
          take: 100,
        });
      },
      DEMO_AUDIT_LOGS as any,
    );
  }

  async getPlatformStats() {
    const demoStats = {
      totalUsers: 142,
      totalStudents: 98,
      totalIndustry: 24,
      totalOpportunities: 35,
      totalApplications: 128,
      totalAssessments: 16,
    };

    return this.prisma.safeExecute(
      async () => {
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
        return { totalUsers, totalStudents, totalIndustry, totalOpportunities, totalApplications, totalAssessments };
      },
      demoStats,
    );
  }
}
