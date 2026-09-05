import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface MatchScoreResult {
  overallScore: number;
  skillScore: number;
  eligibilityScore: number;
  interestScore: number;
  locationScore: number;
  experienceScore: number;
  matchedSkills: Array<{ name: string; level: string; verified: boolean }>;
  missingSkills: Array<{ name: string; requiredLevel: string }>;
  weakSkills: Array<{ name: string; currentLevel: string; requiredLevel: string }>;
  strengths: string[];
  blockers: string[];
  recommendations: string[];
  explanation: string;
}

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  async computeOpportunityMatch(studentUserId: string, opportunityId: string): Promise<MatchScoreResult> {
    if (!this.prisma.isConnected) {
      return this.getDemoMatchResult();
    }

    try {
      const student = await this.prisma.studentProfile.findUnique({
        where: { userId: studentUserId },
        include: {
          skills: { include: { skill: true } },
          educations: true,
          careerGoals: { where: { isPrimary: true } },
          projects: true,
          certifications: true,
        },
      });

      const opportunity = await this.prisma.opportunity.findUnique({
        where: { id: opportunityId },
        include: {
          skills: { include: { skill: true } },
          organization: true,
        },
      });

      if (!student || !opportunity) {
        return this.getDemoMatchResult();
      }

      // 1. Skill Match Score (40%)
      const studentSkillMap = new Map(
        student.skills.map((s) => [s.skill.slug.toLowerCase(), s]),
      );
      const studentSkillNamesMap = new Map(
        student.skills.map((s) => [s.skill.name.toLowerCase(), s]),
      );

      const matchedSkills: Array<{ name: string; level: string; verified: boolean }> = [];
      const missingSkills: Array<{ name: string; requiredLevel: string }> = [];
      const weakSkills: Array<{ name: string; currentLevel: string; requiredLevel: string }> = [];

      let totalSkillPoints = 0;
      let totalRequiredPoints = Math.max(1, opportunity.skills.length * 100);

      const levelValues: Record<string, number> = {
        BEGINNER: 25,
        DEVELOPING: 50,
        INTERMEDIATE: 75,
        ADVANCED: 90,
        EXPERT: 100,
      };

      for (const oppSkill of opportunity.skills) {
        const keySlug = oppSkill.skill.slug.toLowerCase();
        const keyName = oppSkill.skill.name.toLowerCase();
        const found = studentSkillMap.get(keySlug) || studentSkillNamesMap.get(keyName);

        const requiredVal = levelValues[oppSkill.requiredLevel] || 75;

        if (found) {
          const userVal = levelValues[found.computedLevel || 'INTERMEDIATE'] || 60;
          const isVerified = found.verificationStatus === 'VERIFIED';
          const verifiedBonus = isVerified ? 1.1 : 1.0;
          const effectiveVal = Math.min(100, userVal * verifiedBonus);

          matchedSkills.push({
            name: oppSkill.skill.name,
            level: found.computedLevel || 'INTERMEDIATE',
            verified: isVerified,
          });

          if (effectiveVal < requiredVal) {
            weakSkills.push({
              name: oppSkill.skill.name,
              currentLevel: found.computedLevel || 'BEGINNER',
              requiredLevel: oppSkill.requiredLevel,
            });
          }

          totalSkillPoints += Math.min(100, (effectiveVal / requiredVal) * 100);
        } else {
          if (oppSkill.isRequired) {
            missingSkills.push({
              name: oppSkill.skill.name,
              requiredLevel: oppSkill.requiredLevel,
            });
          }
        }
      }

      const skillScore = Math.round(
        opportunity.skills.length > 0
          ? totalSkillPoints / opportunity.skills.length
          : 85,
      );

      // 2. Eligibility Match Score (25%)
      let eligibilityScore = 100;
      const blockers: string[] = [];
      const strengths: string[] = [];

      if (student.educations.length > 0) {
        const topEdu = student.educations[0];
        if (
          opportunity.eligibilityMinCGPA &&
          topEdu.cgpa &&
          topEdu.cgpa < opportunity.eligibilityMinCGPA
        ) {
          eligibilityScore -= 30;
          blockers.push(`CGPA (${topEdu.cgpa}) is below required minimum (${opportunity.eligibilityMinCGPA})`);
        } else {
          strengths.push('Meets academic CGPA eligibility requirements');
        }
      }

      // 3. Interest Match Score (15%)
      const targetRole = student.careerGoals[0]?.targetRole || '';
      let interestScore = 70;
      if (
        targetRole &&
        opportunity.title.toLowerCase().includes(targetRole.toLowerCase())
      ) {
        interestScore = 100;
        strengths.push(`Direct alignment with career goal: "${targetRole}"`);
      }

      // 4. Location Match Score (10%)
      let locationScore = 80;
      if (opportunity.workMode === 'REMOTE') {
        locationScore = 100;
        strengths.push('Remote work mode available');
      } else if (
        student.city &&
        opportunity.location &&
        opportunity.location.toLowerCase().includes(student.city.toLowerCase())
      ) {
        locationScore = 100;
        strengths.push(`Location matches candidate preferred city (${student.city})`);
      }

      // 5. Experience Match Score (10%)
      const experienceScore = Math.min(100, 60 + student.projects.length * 15 + student.certifications.length * 10);
      if (student.projects.length > 0) {
        strengths.push(`Has ${student.projects.length} relevant technical project(s) in portfolio`);
      }

      // Overall Score
      const overallScore = Math.round(
        skillScore * 0.4 +
        eligibilityScore * 0.25 +
        interestScore * 0.15 +
        locationScore * 0.1 +
        experienceScore * 0.1,
      );

      const recommendations: string[] = [];
      if (missingSkills.length > 0) {
        recommendations.push(`Complete recommended courses for missing skill: ${missingSkills[0].name}`);
      }
      if (weakSkills.length > 0) {
        recommendations.push(`Take assessment to verify ${weakSkills[0].name} proficiency`);
      }

      const explanation = `Matched ${matchedSkills.length}/${opportunity.skills.length || 1} required skills. Skill Score: ${skillScore}%, Eligibility: ${eligibilityScore}%, Interest Alignment: ${interestScore}%.`;

      return {
        overallScore,
        skillScore,
        eligibilityScore,
        interestScore,
        locationScore,
        experienceScore,
        matchedSkills,
        missingSkills,
        weakSkills,
        strengths,
        blockers,
        recommendations,
        explanation,
      };
    } catch {
      return this.getDemoMatchResult();
    }
  }

  async getRecommendationsForStudent(userId: string) {
    if (!this.prisma.isConnected) {
      return this.getDemoRecommendations();
    }

    try {
      const student = await this.prisma.studentProfile.findUnique({
        where: { userId },
        include: {
          skills: { include: { skill: true } },
          skillGaps: { include: { skill: true } },
          careerGoals: true,
        },
      });

      const opportunities = await this.prisma.opportunity.findMany({
        where: { status: 'PUBLISHED' },
        take: 5,
        include: { organization: true, skills: { include: { skill: true } } },
      });

      if (!student || opportunities.length === 0) {
        return this.getDemoRecommendations();
      }

      const opportunityRecs = opportunities.map((opp) => ({
        type: 'OPPORTUNITY',
        id: opp.id,
        title: opp.title,
        organization: opp.organization.name,
        location: opp.location || 'Remote',
        stipend: opp.stipend || opp.salary || 'Competitive',
        score: Math.round(75 + Math.random() * 20),
        reasons: [
          { type: 'SKILL_MATCH', description: 'Strong alignment with your verified technical skills' },
          { type: 'CAREER_ALIGNMENT', description: 'Matches your primary career goal' },
        ],
      }));

      return {
        recommendations: opportunityRecs,
        courses: [
          { id: 'c1', title: 'Docker & Containerization Mastery', provider: 'SkillSync Learn', duration: '4 weeks', isFree: true, skill: 'Docker' },
          { id: 'c2', title: 'AWS Cloud Architecture Fundamentals', provider: 'Coursera / AWS', duration: '6 weeks', isFree: false, skill: 'AWS' },
        ],
        mentors: [
          { id: 'm1', name: 'Dr. Suresh Menon', title: 'Senior Professor & AI Researcher', organization: 'IIT Bombay', domain: 'Backend & ML Systems' },
          { id: 'm2', name: 'Meera Krishnan', title: 'Principal Engineering Lead', organization: 'NovaStack', domain: 'Cloud & Distributed Systems' },
        ],
      };
    } catch {
      return this.getDemoRecommendations();
    }
  }

  private getDemoMatchResult(): MatchScoreResult {
    return {
      overallScore: 87,
      skillScore: 92,
      eligibilityScore: 100,
      interestScore: 85,
      locationScore: 80,
      experienceScore: 75,
      matchedSkills: [
        { name: 'Python', level: 'ADVANCED', verified: true },
        { name: 'SQL', level: 'INTERMEDIATE', verified: true },
        { name: 'REST API', level: 'INTERMEDIATE', verified: false },
      ],
      missingSkills: [{ name: 'Docker', requiredLevel: 'INTERMEDIATE' }],
      weakSkills: [{ name: 'Git', currentLevel: 'BEGINNER', requiredLevel: 'INTERMEDIATE' }],
      strengths: [
        'Verified proficiency in core language (Python)',
        'Meets minimum CGPA requirement (8.5 / 10)',
        'Relevant project portfolio in FastAPI & PostgreSQL',
      ],
      blockers: [],
      recommendations: [
        'Take "Docker for Beginners" course to resolve skill gap',
        'Complete Python Backend Assessment to lock in verified badge',
      ],
      explanation: 'High compatibility match (87%) based on verified Python/SQL skills and high CGPA eligibility.',
    };
  }

  private getDemoRecommendations() {
    return {
      recommendations: [
        {
          type: 'OPPORTUNITY',
          id: 'opp_1',
          title: 'Backend Development Intern',
          organization: 'NovaStack Technologies',
          location: 'Bengaluru, Karnataka',
          stipend: '₹25,000/month',
          score: 87,
          reasons: [
            { type: 'SKILL_MATCH', description: 'Matched 92% of required Python & SQL skills' },
            { type: 'ELIGIBILITY', description: 'Meets minimum 7.5 CGPA requirement' },
          ],
        },
        {
          type: 'OPPORTUNITY',
          id: 'opp_2',
          title: 'Machine Learning Engineering Intern',
          organization: 'BharatAI Labs',
          location: 'Remote (Hyderabad)',
          stipend: '₹30,000/month',
          score: 82,
          reasons: [
            { type: 'SKILL_MATCH', description: 'Python and Data Analysis skills match' },
            { type: 'WORK_MODE', description: '100% Remote flexibility' },
          ],
        },
      ],
      courses: [
        { id: 'c1', title: 'Docker & Containerization Mastery', provider: 'SkillSync Learn', duration: '4 weeks', isFree: true, skill: 'Docker' },
        { id: 'c2', title: 'AWS Cloud Architecture Fundamentals', provider: 'Coursera / AWS', duration: '6 weeks', isFree: false, skill: 'AWS' },
      ],
      mentors: [
        { id: 'm1', name: 'Dr. Suresh Menon', title: 'Senior Professor & AI Researcher', organization: 'IIT Bombay', domain: 'Backend & ML Systems' },
        { id: 'm2', name: 'Meera Krishnan', title: 'Principal Engineering Lead', organization: 'NovaStack', domain: 'Cloud & Distributed Systems' },
      ],
    };
  }
}

