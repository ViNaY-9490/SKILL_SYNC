// Gemini AI Provider — uses Google's Gemini API for real AI capabilities
// Falls back gracefully if the API key is missing or quota is exceeded

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import {
  AIProvider,
  AITextOptions,
  AIStructuredOptions,
  ExtractedSkill,
  SkillGapAnalysis,
  OpportunityMatch,
  CareerRecommendation,
} from '../interfaces/ai-provider.interface';

export class GeminiAIProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private textModel: GenerativeModel;
  private embeddingModel: GenerativeModel;

  constructor(
    apiKey: string,
    private modelName: string = 'gemini-2.0-flash',
    private embeddingModelName: string = 'text-embedding-004',
  ) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.textModel = this.genAI.getGenerativeModel({ model: this.modelName });
    this.embeddingModel = this.genAI.getGenerativeModel({ model: this.embeddingModelName });
  }

  async generateText(prompt: string, options?: AITextOptions): Promise<string> {
    const systemInstruction = options?.systemPrompt ||
      'You are SkillSync AI, an intelligent career and skill advisor for students, faculty, and industry professionals. Be concise, actionable, and evidence-based.';

    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction,
      generationConfig: {
        maxOutputTokens: options?.maxTokens || 1024,
        temperature: options?.temperature || 0.4,
      },
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async generateStructuredOutput<T>(
    prompt: string,
    options: AIStructuredOptions<T>,
  ): Promise<T> {
    const structuredPrompt = `${prompt}

Respond with valid JSON only. No markdown, no explanation outside JSON.
Schema: ${options.schema}
${options.exampleOutput ? `Example: ${JSON.stringify(options.exampleOutput)}` : ''}`;

    const text = await this.generateText(structuredPrompt, options);

    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned) as T;
  }

  async embed(text: string): Promise<number[]> {
    const result = await this.embeddingModel.embedContent(text);
    return result.embedding.values;
  }

  async extractSkills(text: string, context?: string): Promise<ExtractedSkill[]> {
    const prompt = `Extract technical and soft skills from the following text.
Context: ${context || 'Student resume/profile'}

Text:
${text.substring(0, 4000)}

Return JSON array of skills with this structure:
[{
  "name": "skill name",
  "category": "Programming|Database|Framework|Tool|Soft Skill|Domain",
  "proficiencyHint": "BEGINNER|INTERMEDIATE|ADVANCED",
  "confidence": 0.0-1.0,
  "evidence": "text excerpt that indicates this skill"
}]

Only include skills explicitly mentioned or clearly implied. Do not invent skills.`;

    try {
      return await this.generateStructuredOutput<ExtractedSkill[]>(prompt, {
        schema: 'Array<{name: string, category: string, proficiencyHint: string, confidence: number, evidence: string}>',
      });
    } catch {
      return [];
    }
  }

  async summarize(text: string, maxLength?: number): Promise<string> {
    const prompt = `Summarize the following text in ${maxLength || 200} words or less. 
Be factual and preserve key skills, experiences, and achievements.

Text:
${text}`;

    return this.generateText(prompt);
  }

  async analyzeSkillGap(
    targetRole: string,
    currentSkills: Array<{ name: string; level: string }>,
    requiredSkills: Array<{ name: string; level: string }>,
  ): Promise<SkillGapAnalysis> {
    const prompt = `Analyze the skill gap for a student targeting the role: "${targetRole}"

Current skills: ${JSON.stringify(currentSkills)}
Required skills for the role: ${JSON.stringify(requiredSkills)}

Return a JSON object with:
{
  "targetRole": string,
  "currentSkills": string[],
  "gaps": [{"skill": string, "severity": "CRITICAL|HIGH|MEDIUM|LOW", "estimatedEffort": string, "reason": string}],
  "strengths": string[],
  "readinessScore": number (0-100),
  "narrative": string (2-3 sentences)
}`;

    return this.generateStructuredOutput<SkillGapAnalysis>(prompt, {
      schema: 'SkillGapAnalysis object',
    });
  }

  async computeOpportunityMatch(
    studentProfile: Record<string, unknown>,
    opportunity: Record<string, unknown>,
  ): Promise<OpportunityMatch> {
    const prompt = `Compute an opportunity match score for a student applying to an opportunity.

Student profile (skills, level, experience):
${JSON.stringify(studentProfile, null, 2)}

Opportunity requirements:
${JSON.stringify(opportunity, null, 2)}

Scoring weights:
- Skill compatibility: 35%
- Skill proficiency: 20%  
- Eligibility criteria: 15%
- Career interest alignment: 10%
- Project evidence: 10%
- Location/workmode: 5%
- Experience: 5%

Return JSON:
{
  "overallScore": number,
  "skillScore": number,
  "proficiencyScore": number,
  "eligibilityScore": number,
  "matchedSkills": string[],
  "missingSkills": string[],
  "weakSkills": string[],
  "strengths": string[],
  "blockers": string[],
  "recommendations": string[],
  "explanation": string
}`;

    return this.generateStructuredOutput<OpportunityMatch>(prompt, {
      schema: 'OpportunityMatch object',
    });
  }

  async generateRecommendations(
    studentProfile: Record<string, unknown>,
    context: Record<string, unknown>,
  ): Promise<CareerRecommendation[]> {
    const prompt = `Generate 5 personalized career recommendations for a student.

Student profile:
${JSON.stringify(studentProfile, null, 2)}

Context (career goals, gaps, interests):
${JSON.stringify(context, null, 2)}

Return JSON array of recommendations:
[{
  "type": "OPPORTUNITY|COURSE|PROJECT|CERTIFICATION|MENTOR",
  "title": string,
  "description": string,
  "score": number (0-100),
  "reasons": [{"type": "SKILL_MATCH|SKILL_GAP|CAREER_GOAL|EVIDENCE", "description": string, "skill"?: string}]
}]

Prioritize: high skill match, closing critical gaps, career goal alignment.
Be specific and actionable.`;

    return this.generateStructuredOutput<CareerRecommendation[]>(prompt, {
      schema: 'Array<CareerRecommendation>',
    });
  }
}
