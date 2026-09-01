// Demo AI Provider — returns deterministic, realistic responses when real AI is unavailable
// This ensures the application works completely in demo mode without API keys

import {
  AIProvider,
  AITextOptions,
  AIStructuredOptions,
  ExtractedSkill,
  SkillGapAnalysis,
  OpportunityMatch,
  CareerRecommendation,
} from '../interfaces/ai-provider.interface';

export class DemoAIProvider implements AIProvider {
  private readonly demoSkillSets: Record<string, ExtractedSkill[]> = {
    default: [
      { name: 'Python', category: 'Programming', proficiencyHint: 'INTERMEDIATE', confidence: 0.92, evidence: 'Python development experience' },
      { name: 'JavaScript', category: 'Programming', proficiencyHint: 'INTERMEDIATE', confidence: 0.88, evidence: 'Frontend/backend JS work' },
      { name: 'SQL', category: 'Database', proficiencyHint: 'INTERMEDIATE', confidence: 0.85, evidence: 'Database query experience' },
      { name: 'REST API', category: 'Backend', proficiencyHint: 'BEGINNER', confidence: 0.78, evidence: 'API development' },
      { name: 'Git', category: 'Tools', proficiencyHint: 'INTERMEDIATE', confidence: 0.90, evidence: 'Version control usage' },
    ],
  };

  async generateText(prompt: string, _options?: AITextOptions): Promise<string> {
    const p = prompt.toLowerCase();

    // 1. Backend / 3-month roadmap questions
    if (p.includes('backend') || p.includes('3 months') || p.includes('prioritize')) {
      return `To land a **Backend Engineer** role over the next 3 months, prioritize this structured roadmap:

**Month 1: Advanced Backend Fundamentals & Databases**
• **Python & FastAPI/Django:** Master asynchronous handling, dependency injection, and Pydantic validation.
• **Database Design & Indexing:** Write complex SQL queries, JOINs, transactions, and indexing strategies in PostgreSQL.

**Month 2: Containerization & Cloud Infrastructure**
• **Docker & Docker Compose:** Containerize multi-tier applications (API + Database + Redis).
• **Caching & Messaging:** Integrate Redis caching for fast session lookups and BullMQ/Celery for background jobs.

**Month 3: System Design & Interview Preparation**
• **REST API Security & JWT:** Implement rate limiting, CORS, role-based access control (RBAC), and HTTPS.
• **Mock Interviews & Portfolio:** Deploy 2 full-stack projects to AWS/Render and practice system design scenarios (rate limiters, URL shorteners).`;
    }

    // 2. Skill Gap & Profile Questions
    if (p.includes('gap') || p.includes('profile') || p.includes('analyze')) {
      return `Based on your skill profile (**Python, SQL, REST API**), here is your skill gap evaluation:

🎯 **Current Strengths:**
• Solid foundation in Python programming and relational database querying.
• Understanding of web API standards and basic HTTP methods.

⚡ **Top 3 Priority Skill Gaps:**
1. **Docker & Containerization (Critical):** Necessary for 85% of modern backend roles.
2. **System Design & Caching (High):** Required for mid-to-senior backend performance.
3. **Cloud Deployment AWS/GCP (Medium):** Essential for production environment management.

💡 **Action Plan:** Spend 2 weeks on Docker basics, then build a containerized REST API project with Redis caching.`;
    }

    // 3. Learning Resources Questions
    if (p.includes('resource') || p.includes('learn') || p.includes('course')) {
      return `Here are the top recommended learning resources for your skill growth:

📚 **Docker & DevOps:**
• *Docker for Beginners* (Hands-on Lab) — Coursera / Docker Docs
• *AWS Cloud Practitioner Essentials* — Official AWS Training (Free)

💻 **Backend & System Design:**
• *FastAPI Official Documentation & Tutorial* (FastAPI Docs)
• *ByteByteGo System Design Fundamentals* — System Design Interview Primer

🏆 **Practice Platforms:**
• *LeetCode* (Medium SQL & Algorithm Questions)
• *SkillSync Assessment Sandbox* for instant skill verification badges.`;
    }

    // 4. Interview Preparation
    if (p.includes('interview') || p.includes('prep') || p.includes('question')) {
      return `Here are top technical interview questions for **Python Backend Roles**:

1. **Python Internal Memory & OOP:** Explain the difference between \`list.append()\` vs \`list.extend()\`, and how Python GIL affects multi-threading.
2. **Database & SQL:** What is the difference between \`WHERE\` and \`HAVING\`? How do indexes speed up SELECT queries?
3. **Web Architecture:** Explain JWT authentication flow and how to invalidate JWT access tokens securely using Redis revocation lists.
4. **System Design:** How would you design a rate-limiting middleware that limits users to 100 requests per minute?`;
    }

    // Default rich fallback
    return `Great question! Here is an AI career insight based on current industry hiring trends:

• **Core Competency:** Focus on strong problem-solving and writing clean, testable code with unit tests.
• **Demonstrable Proof:** Recruiters favor candidates with live GitHub project repositories and verified skill badges over plain resume bullet points.
• **Action Step:** Explore the **Skill Gap Engine** in your dashboard to view personalized course recommendations and raise your Placement Readiness Score!`;
  }

  async generateStructuredOutput<T>(
    _prompt: string,
    _options: AIStructuredOptions<T>,
  ): Promise<T> {
    return {} as T;
  }

  async embed(_text: string): Promise<number[]> {
    return Array(1536).fill(0).map((_, i) => Math.sin(i * 0.1) * 0.1);
  }

  async extractSkills(text: string, _context?: string): Promise<ExtractedSkill[]> {
    const skills = this.demoSkillSets.default;
    const lowerText = text.toLowerCase();
    const detected = skills.filter(skill => lowerText.includes(skill.name.toLowerCase()));
    return detected.length > 0 ? detected : skills.slice(0, 3);
  }

  async summarize(text: string, maxLength?: number): Promise<string> {
    const limit = maxLength || 200;
    if (text.length <= limit) return text;
    return text.substring(0, limit).trim() + '... [AI summary complete]';
  }

  async analyzeSkillGap(
    targetRole: string,
    currentSkills: Array<{ name: string; level: string }>,
    requiredSkills: Array<{ name: string; level: string }>,
  ): Promise<SkillGapAnalysis> {
    const currentSkillNames = currentSkills.map(s => s.name.toLowerCase());
    const gaps = requiredSkills
      .filter(s => !currentSkillNames.includes(s.name.toLowerCase()))
      .map((s, i) => ({
        skill: s.name,
        severity: (i === 0 ? 'HIGH' : i === 1 ? 'MEDIUM' : 'LOW') as 'HIGH' | 'MEDIUM' | 'LOW',
        estimatedEffort: i === 0 ? '4-6 weeks' : '2-4 weeks',
        reason: `Required for ${targetRole} — not present in current skill profile`,
      }));

    const matchCount = requiredSkills.length - gaps.length;
    const readinessScore = Math.round((matchCount / Math.max(requiredSkills.length, 1)) * 100);

    return {
      targetRole,
      currentSkills: currentSkillNames,
      gaps,
      strengths: currentSkills.map(s => s.name),
      readinessScore,
      narrative: `For ${targetRole}, you have ${matchCount} of ${requiredSkills.length} required skills. Focus on closing the ${gaps.length} identified gaps to significantly improve your match rate.`,
    };
  }

  async computeOpportunityMatch(
    studentProfile: Record<string, unknown>,
    opportunity: Record<string, unknown>,
  ): Promise<OpportunityMatch> {
    const studentSkills = (studentProfile.skills as string[]) || ['Python', 'SQL', 'REST API'];
    const requiredSkills = (opportunity.skills as string[]) || ['Python', 'SQL', 'Docker'];

    const matched = studentSkills.filter(s =>
      requiredSkills.some(r => r.toLowerCase() === s.toLowerCase()),
    );
    const missing = requiredSkills.filter(
      r => !studentSkills.some(s => s.toLowerCase() === r.toLowerCase()),
    );

    const skillScore = requiredSkills.length > 0
      ? Math.round((matched.length / requiredSkills.length) * 100)
      : 85;

    const overallScore = Math.min(Math.round(skillScore * 0.6 + 80 * 0.4), 100);

    return {
      overallScore,
      skillScore,
      proficiencyScore: 80,
      eligibilityScore: 90,
      matchedSkills: matched,
      missingSkills: missing,
      weakSkills: [],
      strengths: matched.length > 0 ? [`Strong in ${matched.join(', ')}`] : ['Python background'],
      blockers: missing.length > 2 ? [`Missing ${missing.length} required skills`] : [],
      recommendations: missing.slice(0, 3).map(s => `Learn ${s}`),
      explanation: `You match ${matched.length} of ${requiredSkills.length} required skills. Overall readiness: ${overallScore}%.`,
    };
  }

  async generateRecommendations(
    _studentProfile: Record<string, unknown>,
    _context: Record<string, unknown>,
  ): Promise<CareerRecommendation[]> {
    return [
      {
        type: 'COURSE',
        title: 'Python for Backend Development',
        description: 'Comprehensive Python course covering FastAPI, PostgreSQL, and REST API development',
        score: 92,
        reasons: [
          { type: 'SKILL_GAP', description: 'Closes backend framework gap', skill: 'FastAPI' },
          { type: 'CAREER_GOAL', description: 'Directly aligned with backend developer goal' },
        ],
      },
      {
        type: 'OPPORTUNITY',
        title: 'Backend Development Intern — NovaStack Technologies',
        description: '3-month backend development internship with mentorship',
        score: 87,
        reasons: [
          { type: 'SKILL_MATCH', description: 'Python, SQL skills match requirements', skill: 'Python' },
          { type: 'CAREER_GOAL', description: 'Real-world backend experience' },
        ],
      },
    ];
  }
}
