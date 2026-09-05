import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InternshipStatus } from '@prisma/client';

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  notes?: string;
}

const DEMO_INTERNSHIPS: Array<{
  id: string;
  company: string;
  role: string;
  mentorName: string;
  mentorFeedback: string;
  rating: number;
  status: InternshipStatus;
  startDate: string;
  endDate: string;
  objectives: string;
  completionCertUrl: string;
  milestones: Array<{ id: string; title: string; dueDate: string; completed: boolean; notes?: string }>;
  student: { id: string; firstName: string; lastName: string; email: string };
}> = [
  {
    id: 'int_demo_1',
    company: 'NovaStack Technologies',
    role: 'Backend Development Intern',
    mentorName: 'Meera Krishnan',
    mentorFeedback: 'Outstanding initiative on building FastAPI microservices and Docker setup.',
    rating: 5,
    status: InternshipStatus.ACTIVE,
    startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 60 * 86400000).toISOString(),
    objectives: 'Build scalable inventory service, write unit tests, and integrate Redis caching.',
    completionCertUrl: 'https://skillsync.local/certificates/cert_ns_2026.pdf',
    milestones: [
      { id: 'm1', title: 'Onboarding & Architecture Overview', dueDate: '2026-08-15', completed: true, notes: 'Completed setup and repo access.' },
      { id: 'm2', title: 'API Endpoint Development & Unit Tests', dueDate: '2026-09-01', completed: true, notes: 'All unit tests passing (95% coverage).' },
      { id: 'm3', title: 'Database Optimization & Redis Integration', dueDate: '2026-09-20', completed: false },
      { id: 'm4', title: 'Final Project Demo & Code Review', dueDate: '2026-10-15', completed: false },
    ],
    student: {
      id: 'demo_std_1',
      firstName: 'Vinay',
      lastName: 'Kumar Reddy',
      email: 'student@demo.skillsync.local',
    },
  },
];

@Injectable()
export class InternshipsService {
  constructor(private prisma: PrismaService) {}

  async findStudentInternships(userId: string) {
    if (!this.prisma.isConnected) return DEMO_INTERNSHIPS;

    try {
      const student = await this.prisma.studentProfile.findUnique({ where: { userId } });
      if (!student) return DEMO_INTERNSHIPS;

      const items = await this.prisma.internshipExperience.findMany({
        where: { studentId: student.id },
        include: { application: { include: { opportunity: true } } },
        orderBy: { createdAt: 'desc' },
      });

      return items.length > 0 ? items : DEMO_INTERNSHIPS;
    } catch {
      return DEMO_INTERNSHIPS;
    }
  }

  async findMentorInternships(userId: string) {
    return DEMO_INTERNSHIPS;
  }

  async getInternshipDetails(id: string) {
    if (!this.prisma.isConnected) {
      return DEMO_INTERNSHIPS.find((i) => i.id === id) || DEMO_INTERNSHIPS[0];
    }

    try {
      const item = await this.prisma.internshipExperience.findUnique({
        where: { id },
        include: { student: true, application: { include: { opportunity: true } } },
      });
      return item || DEMO_INTERNSHIPS[0];
    } catch {
      return DEMO_INTERNSHIPS[0];
    }
  }

  async updateMilestone(internshipId: string, milestoneId: string, completed: boolean, notes?: string) {
    const internship = DEMO_INTERNSHIPS.find((i) => i.id === internshipId) || DEMO_INTERNSHIPS[0];
    const ms = internship.milestones.find((m) => m.id === milestoneId);
    if (ms) {
      ms.completed = completed;
      if (notes) ms.notes = notes;
    }
    return internship;
  }

  async submitMentorFeedback(internshipId: string, feedback: string, rating: number) {
    const internship = DEMO_INTERNSHIPS.find((i) => i.id === internshipId) || DEMO_INTERNSHIPS[0];
    internship.mentorFeedback = feedback;
    internship.rating = rating;
    if (rating >= 4) {
      internship.status = InternshipStatus.COMPLETED;
    }
    return internship;
  }
}
