import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEMO_INSTITUTIONS = [
  {
    id: 'inst_1',
    name: 'Vellore Institute of Technology (VIT Bhopal)',
    code: 'VITB',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    departments: [
      { id: 'dept_1', name: 'Computer Science & Engineering', code: 'CSE' },
      { id: 'dept_2', name: 'Artificial Intelligence & Robotics', code: 'AIR' },
    ],
    _count: { enrollments: 1250, placementDrives: 18 },
  },
];

const DEMO_INST_STUDENTS = [
  {
    id: 'std_inst_1',
    firstName: 'Vinay',
    lastName: 'Kumar Reddy',
    placementReadinessScore: 88,
    user: { email: 'student@skillsync.local', status: 'ACTIVE' },
    skills: [
      { skill: { name: 'Python' } },
      { skill: { name: 'React' } },
      { skill: { name: 'SQL' } },
    ],
    enrollments: [
      {
        institution: { name: 'VIT Bhopal' },
        department: { name: 'Computer Science' },
        program: { name: 'B.Tech' },
      },
    ],
  },
  {
    id: 'std_inst_2',
    firstName: 'Ananya',
    lastName: 'Deshmukh',
    placementReadinessScore: 82,
    user: { email: 'ananya@skillsync.local', status: 'ACTIVE' },
    skills: [
      { skill: { name: 'Java' } },
      { skill: { name: 'Spring Boot' } },
    ],
    enrollments: [
      {
        institution: { name: 'VIT Bhopal' },
        department: { name: 'Computer Science' },
        program: { name: 'B.Tech' },
      },
    ],
  },
];

const DEMO_SKILL_MATRIX = [
  { skill: 'Python', demandLevel: 95, studentCount: 42, opportunityCount: 18, gapIndex: 96 },
  { skill: 'Docker', demandLevel: 92, studentCount: 12, opportunityCount: 22, gapIndex: 196 },
  { skill: 'React', demandLevel: 90, studentCount: 38, opportunityCount: 15, gapIndex: 74 },
  { skill: 'SQL', demandLevel: 88, studentCount: 45, opportunityCount: 20, gapIndex: 110 },
  { skill: 'AWS', demandLevel: 94, studentCount: 8, opportunityCount: 19, gapIndex: 174 },
];

const DEMO_DRIVES = [
  {
    id: 'drive_1',
    title: 'NovaStack Campus Hiring Drive 2026',
    status: 'ACTIVE',
    eligibleCount: 120,
    shortlistedCount: 34,
    createdAt: new Date().toISOString(),
    institution: { name: 'VIT Bhopal' },
  },
  {
    id: 'drive_2',
    title: 'CloudForge Off-Campus Hiring Drive',
    status: 'COMPLETED',
    eligibleCount: 200,
    shortlistedCount: 45,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    institution: { name: 'VIT Bhopal' },
  },
];

@Injectable()
export class InstitutionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.safeExecute(
      () =>
        this.prisma.institution.findMany({
          include: {
            departments: true,
            _count: { select: { enrollments: true, placementDrives: true } },
          },
        }),
      DEMO_INSTITUTIONS as any,
    );
  }

  async findOne(id: string) {
    if (!this.prisma.isConnected) return DEMO_INSTITUTIONS[0];
    try {
      const institution = await this.prisma.institution.findUnique({
        where: { id },
        include: {
          departments: { include: { programs: true } },
          placementDrives: true,
        },
      });
      return institution || DEMO_INSTITUTIONS[0];
    } catch {
      return DEMO_INSTITUTIONS[0];
    }
  }

  async getStudents(userId: string) {
    return this.prisma.safeExecute(
      () =>
        this.prisma.studentProfile.findMany({
          include: {
            user: { select: { email: true, status: true } },
            skills: { include: { skill: true } },
            enrollments: { include: { institution: true, department: true, program: true } },
          },
          orderBy: { placementReadinessScore: 'desc' },
          take: 100,
        }),
      DEMO_INST_STUDENTS as any,
    );
  }

  async getSkillMatrix() {
    if (!this.prisma.isConnected) return DEMO_SKILL_MATRIX;
    try {
      const skills = await this.prisma.skill.findMany({
        take: 20,
        orderBy: { demandLevel: 'desc' },
        include: {
          _count: { select: { studentSkills: true, opportunitySkills: true } },
        },
      });

      if (skills.length === 0) return DEMO_SKILL_MATRIX;

      return skills.map((s) => ({
        skill: s.name,
        demandLevel: s.demandLevel,
        studentCount: s._count.studentSkills,
        opportunityCount: s._count.opportunitySkills,
        gapIndex: Math.max(0, s._count.opportunitySkills * 10 - s._count.studentSkills * 2),
      }));
    } catch {
      return DEMO_SKILL_MATRIX;
    }
  }

  async getPlacementDriveStats() {
    return this.prisma.safeExecute(
      () =>
        this.prisma.placementDrive.findMany({
          include: { institution: true },
          orderBy: { createdAt: 'desc' },
        }),
      DEMO_DRIVES as any,
    );
  }
}
