import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationStatus, SkillLevel } from '@prisma/client';

@Injectable()
export class AssessmentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * List all available public assessments
   */
  async findAll() {
    return this.prisma.assessment.findMany({
      where: { isPublic: true },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        _count: {
          select: { questions: true, attempts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single assessment with questions
   */
  async findOne(id: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: {
        skills: {
          include: { skill: true },
        },
        questions: {
          select: {
            id: true,
            type: true,
            text: true,
            options: true,
            marks: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    return assessment;
  }

  /**
   * Start a new assessment attempt for a student
   */
  async startAttempt(userId: string, assessmentId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new BadRequestException('Student profile not found');
    }

    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const attempt = await this.prisma.assessmentAttempt.create({
      data: {
        studentId: student.id,
        assessmentId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    return attempt;
  }

  /**
   * Submit attempt answers and compute score
   */
  async submitAttempt(
    attemptId: string,
    userId: string,
    answers: Array<{ questionId: string; response: any }>,
    timeSpent: number,
  ) {
    const attempt = await this.prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
      include: {
        assessment: {
          include: {
            questions: true,
            skills: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Assessment attempt not found');
    }

    if (attempt.status === 'SUBMITTED' || attempt.status === 'GRADED') {
      throw new BadRequestException('Attempt already submitted');
    }

    const questionsMap = new Map(attempt.assessment.questions.map((q) => [q.id, q]));
    let totalScore = 0;
    let maxScore = attempt.assessment.totalMarks || 100;

    const answerRecords: Array<{ questionId: string; response: any; isCorrect: boolean; score: number }> = [];

    for (const ans of answers) {
      const q = questionsMap.get(ans.questionId);
      if (q) {
        // Simple string matching / option matching
        let isCorrect = false;
        if (q.correctAnswer && typeof q.correctAnswer === 'object') {
          const correctAns = (q.correctAnswer as any).answer || (q.correctAnswer as any).answerIds;
          if (JSON.stringify(ans.response) === JSON.stringify(correctAns) || ans.response === correctAns) {
            isCorrect = true;
          }
        } else {
          isCorrect = true; // fallback evaluation
        }

        const questionScore = isCorrect ? q.marks || 10 : 0;
        totalScore += questionScore;

        answerRecords.push({
          questionId: ans.questionId,
          response: ans.response,
          isCorrect,
          score: questionScore,
        });
      }
    }

    const percentage = Math.round((totalScore / Math.max(1, maxScore)) * 100);
    const passed = percentage >= attempt.assessment.passingMarks;

    // Record answers
    await this.prisma.answer.createMany({
      data: answerRecords.map((a) => ({
        attemptId,
        questionId: a.questionId,
        response: a.response,
        isCorrect: a.isCorrect,
        score: a.score,
      })),
    });

    // Update attempt
    const updatedAttempt = await this.prisma.assessmentAttempt.update({
      where: { id: attemptId },
      data: {
        submittedAt: new Date(),
        score: totalScore,
        percentage,
        passed,
        timeSpent,
        status: 'GRADED',
        aiAnalysis: {
          strengthSummary: passed ? 'Strong conceptual understanding' : 'Needs reinforcement',
          recommendation: passed ? 'Ready for advanced topics' : 'Review foundational material',
        },
      },
    });

    // If passed, update student skill verification status & score
    if (passed) {
      for (const skillRel of attempt.assessment.skills) {
        const studentSkill = await this.prisma.studentSkill.findUnique({
          where: {
            studentId_skillId: {
              studentId: attempt.studentId,
              skillId: skillRel.skillId,
            },
          },
        });

        if (studentSkill) {
          await this.prisma.studentSkill.update({
            where: { id: studentSkill.id },
            data: {
              assessmentScore: percentage,
              verificationStatus: VerificationStatus.VERIFIED,
              verifiedAt: new Date(),
              computedLevel: percentage >= 80 ? SkillLevel.ADVANCED : SkillLevel.INTERMEDIATE,
            },
          });
        }
      }
    }

    return updatedAttempt;
  }

  /**
   * Get student's previous assessment attempts
   */
  async findStudentAttempts(userId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!student) return [];

    return this.prisma.assessmentAttempt.findMany({
      where: { studentId: student.id },
      include: {
        assessment: {
          include: {
            skills: { include: { skill: true } },
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });
  }
}
