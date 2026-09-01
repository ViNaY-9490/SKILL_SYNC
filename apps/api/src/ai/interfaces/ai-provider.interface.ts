// AI Provider abstraction layer
// All AI calls go through this interface — never call model APIs directly from business logic
// This allows swapping providers (Gemini → OpenAI → local) without changing application code

export interface AITextOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface AIStructuredOptions<T> extends AITextOptions {
  schema: string; // JSON schema description for structured output
  exampleOutput?: T;
}

export interface ExtractedSkill {
  name: string;
  category?: string;
  proficiencyHint?: string; // BEGINNER | INTERMEDIATE | ADVANCED based on context
  confidence: number; // 0-1
  evidence: string; // excerpt from text that indicates this skill
}

export interface SkillGapAnalysis {
  targetRole: string;
  currentSkills: string[];
  gaps: Array<{
    skill: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    estimatedEffort: string;
    reason: string;
  }>;
  strengths: string[];
  readinessScore: number; // 0-100
  narrative: string;
}

export interface OpportunityMatch {
  overallScore: number; // 0-100
  skillScore: number;
  proficiencyScore: number;
  eligibilityScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  weakSkills: string[];
  strengths: string[];
  blockers: string[];
  recommendations: string[];
  explanation: string;
}

export interface CareerRecommendation {
  type: 'OPPORTUNITY' | 'COURSE' | 'PROJECT' | 'CERTIFICATION' | 'MENTOR';
  title: string;
  description: string;
  score: number;
  reasons: Array<{ type: string; description: string; skill?: string }>;
  actionUrl?: string;
}

// The provider interface — implement this for any AI backend
export interface AIProvider {
  generateText(prompt: string, options?: AITextOptions): Promise<string>;

  generateStructuredOutput<T>(
    prompt: string,
    options: AIStructuredOptions<T>,
  ): Promise<T>;

  embed(text: string): Promise<number[]>;

  extractSkills(text: string, context?: string): Promise<ExtractedSkill[]>;

  summarize(text: string, maxLength?: number): Promise<string>;

  analyzeSkillGap(
    targetRole: string,
    currentSkills: Array<{ name: string; level: string }>,
    requiredSkills: Array<{ name: string; level: string }>,
  ): Promise<SkillGapAnalysis>;

  computeOpportunityMatch(
    studentProfile: Record<string, unknown>,
    opportunity: Record<string, unknown>,
  ): Promise<OpportunityMatch>;

  generateRecommendations(
    studentProfile: Record<string, unknown>,
    context: Record<string, unknown>,
  ): Promise<CareerRecommendation[]>;
}
