// Ollama AI Provider — local LLM provider (Ollama)
// Runs 100% locally via http://localhost:11434 with automatic model detection

import axios from 'axios';
import {
  AIProvider,
  AITextOptions,
  AIStructuredOptions,
  ExtractedSkill,
  SkillGapAnalysis,
  OpportunityMatch,
  CareerRecommendation,
} from '../interfaces/ai-provider.interface';
import { DemoAIProvider } from './demo-ai.provider';

export class OllamaAIProvider implements AIProvider {
  private demoFallback: DemoAIProvider;
  private activeModel: string;
  private modelDetected = false;

  constructor(
    private baseUrl: string = 'http://localhost:11434',
    private defaultModel: string = 'llama3',
  ) {
    this.demoFallback = new DemoAIProvider();
    this.activeModel = defaultModel;
  }

  private async detectAvailableModel(): Promise<string> {
    if (this.modelDetected) return this.activeModel;

    try {
      // Check installed models in Ollama via /api/tags
      const { data } = await axios.get(`${this.baseUrl}/api/tags`, { timeout: 3000 });
      if (data?.models && Array.isArray(data.models) && data.models.length > 0) {
        const modelNames = data.models.map((m: any) => m.name || m.model);
        // Prefer defaultModel if available, else pick first available model
        const match = modelNames.find((name: string) =>
          name.toLowerCase().includes(this.defaultModel.toLowerCase()),
        );
        this.activeModel = match || modelNames[0];
        console.log(`🤖 Ollama connected! Active local model: ${this.activeModel}`);
      }
    } catch {
      // Ollama not reachable or no models found
    }

    this.modelDetected = true;
    return this.activeModel;
  }

  async generateText(prompt: string, options?: AITextOptions): Promise<string> {
    const model = await this.detectAvailableModel();

    try {
      // Try /api/chat endpoint first (standard in modern Ollama)
      const response = await axios.post(
        `${this.baseUrl}/api/chat`,
        {
          model,
          messages: [
            ...(options?.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
            { role: 'user', content: prompt },
          ],
          stream: false,
          options: {
            temperature: options?.temperature ?? 0.4,
            num_predict: options?.maxTokens ?? 1024,
          },
        },
        { timeout: 30000 },
      );

      const reply = response.data?.message?.content;
      if (reply) return reply;
    } catch {
      // Try fallback /api/generate endpoint if /api/chat is unavailable
      try {
        const response = await axios.post(
          `${this.baseUrl}/api/generate`,
          {
            model,
            prompt: `${options?.systemPrompt ? `[System: ${options.systemPrompt}]\n\n` : ''}${prompt}`,
            stream: false,
          },
          { timeout: 30000 },
        );

        const reply = response.data?.response;
        if (reply) return reply;
      } catch {
        // Silent fallback to rich DemoAIProvider if model not pulled
      }
    }

    return this.demoFallback.generateText(prompt, options);
  }

  async generateStructuredOutput<T>(
    prompt: string,
    options: AIStructuredOptions<T>,
  ): Promise<T> {
    const structuredPrompt = `${prompt}

Respond ONLY with valid JSON matching this schema description: ${options.schema}
Do NOT include markdown fences, comments, or extra text.`;

    try {
      const rawText = await this.generateText(structuredPrompt, options);
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned) as T;
    } catch {
      return this.demoFallback.generateStructuredOutput<T>(prompt, options);
    }
  }

  async embed(text: string): Promise<number[]> {
    const model = await this.detectAvailableModel();
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/embeddings`,
        { model, prompt: text },
        { timeout: 10000 },
      );
      return response.data?.embedding || await this.demoFallback.embed(text);
    } catch {
      return this.demoFallback.embed(text);
    }
  }

  async extractSkills(text: string, context?: string): Promise<ExtractedSkill[]> {
    try {
      const prompt = `Extract technical and soft skills from the following text. Context: ${context || 'Student profile'}

Text:
${text.substring(0, 3000)}

Return JSON array:
[{"name": "Skill Name", "category": "Programming|Database|Backend|Frontend|Cloud|AI-ML|Tools|Soft Skill", "proficiencyHint": "BEGINNER|INTERMEDIATE|ADVANCED", "confidence": 0.9, "evidence": "Excerpt"}]`;

      const result = await this.generateStructuredOutput<ExtractedSkill[]>(prompt, {
        schema: 'Array<{name: string, category: string, proficiencyHint: string, confidence: number, evidence: string}>',
      });
      return Array.isArray(result) && result.length > 0 ? result : this.demoFallback.extractSkills(text, context);
    } catch {
      return this.demoFallback.extractSkills(text, context);
    }
  }

  async summarize(text: string, maxLength?: number): Promise<string> {
    try {
      const prompt = `Summarize the following text in under ${maxLength || 150} words:

${text}`;
      return await this.generateText(prompt);
    } catch {
      return this.demoFallback.summarize(text, maxLength);
    }
  }

  async analyzeSkillGap(
    targetRole: string,
    currentSkills: Array<{ name: string; level: string }>,
    requiredSkills: Array<{ name: string; level: string }>,
  ): Promise<SkillGapAnalysis> {
    try {
      const prompt = `Analyze the skill gap for role "${targetRole}".
Current skills: ${JSON.stringify(currentSkills)}
Required skills: ${JSON.stringify(requiredSkills)}`;

      const result = await this.generateStructuredOutput<SkillGapAnalysis>(prompt, {
        schema: 'SkillGapAnalysis object with targetRole, currentSkills, gaps, strengths, readinessScore, narrative',
      });
      return result?.gaps ? result : this.demoFallback.analyzeSkillGap(targetRole, currentSkills, requiredSkills);
    } catch {
      return this.demoFallback.analyzeSkillGap(targetRole, currentSkills, requiredSkills);
    }
  }

  async computeOpportunityMatch(
    studentProfile: Record<string, unknown>,
    opportunity: Record<string, unknown>,
  ): Promise<OpportunityMatch> {
    try {
      return await this.demoFallback.computeOpportunityMatch(studentProfile, opportunity);
    } catch {
      return this.demoFallback.computeOpportunityMatch(studentProfile, opportunity);
    }
  }

  async generateRecommendations(
    studentProfile: Record<string, unknown>,
    context: Record<string, unknown>,
  ): Promise<CareerRecommendation[]> {
    try {
      return await this.demoFallback.generateRecommendations(studentProfile, context);
    } catch {
      return this.demoFallback.generateRecommendations(studentProfile, context);
    }
  }
}
