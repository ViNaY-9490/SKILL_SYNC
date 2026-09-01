import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AIProvider,
  AITextOptions,
  AIStructuredOptions,
  ExtractedSkill,
  SkillGapAnalysis,
  OpportunityMatch,
  CareerRecommendation,
} from './interfaces/ai-provider.interface';
import { GeminiAIProvider } from './providers/gemini-ai.provider';
import { OllamaAIProvider } from './providers/ollama-ai.provider';
import { DemoAIProvider } from './providers/demo-ai.provider';

@Injectable()
export class AiService implements AIProvider {
  private provider: AIProvider;
  public readonly isDemoMode: boolean;
  public readonly providerName: string;

  constructor(private config: ConfigService) {
    const aiProviderChoice = config.get<string>('AI_PROVIDER', '').toLowerCase();
    const apiKey = config.get<string>('GEMINI_API_KEY');
    const ollamaUrl = config.get<string>('OLLAMA_BASE_URL', 'http://localhost:11434');
    const ollamaModel = config.get<string>('OLLAMA_MODEL', 'llama3');
    const demoMode = config.get<boolean>('AI_DEMO_MODE', false);

    if (aiProviderChoice === 'ollama') {
      this.provider = new OllamaAIProvider(ollamaUrl, ollamaModel);
      this.isDemoMode = false;
      this.providerName = `Ollama (${ollamaModel})`;
      console.log(`🤖 AI running with local Ollama provider at ${ollamaUrl} [model: ${ollamaModel}]`);
    } else if (apiKey && !demoMode && aiProviderChoice !== 'demo') {
      this.provider = new GeminiAIProvider(
        apiKey,
        config.get<string>('AI_MODEL', 'gemini-2.0-flash'),
        config.get<string>('EMBEDDING_MODEL', 'text-embedding-004'),
      );
      this.isDemoMode = false;
      this.providerName = 'Gemini 2.0 Flash';
      console.log('🤖 AI running with Google Gemini provider');
    } else {
      this.provider = new DemoAIProvider();
      this.isDemoMode = true;
      this.providerName = 'Demo Provider';
      console.log('🤖 AI running in DEMO mode — set AI_PROVIDER=ollama or GEMINI_API_KEY to enable live LLMs');
    }
  }

  generateText(prompt: string, options?: AITextOptions): Promise<string> {
    return this.provider.generateText(prompt, options);
  }

  generateStructuredOutput<T>(prompt: string, options: AIStructuredOptions<T>): Promise<T> {
    return this.provider.generateStructuredOutput(prompt, options);
  }

  embed(text: string): Promise<number[]> {
    return this.provider.embed(text);
  }

  extractSkills(text: string, context?: string): Promise<ExtractedSkill[]> {
    return this.provider.extractSkills(text, context);
  }

  summarize(text: string, maxLength?: number): Promise<string> {
    return this.provider.summarize(text, maxLength);
  }

  analyzeSkillGap(
    targetRole: string,
    currentSkills: Array<{ name: string; level: string }>,
    requiredSkills: Array<{ name: string; level: string }>,
  ): Promise<SkillGapAnalysis> {
    return this.provider.analyzeSkillGap(targetRole, currentSkills, requiredSkills);
  }

  computeOpportunityMatch(
    studentProfile: Record<string, unknown>,
    opportunity: Record<string, unknown>,
  ): Promise<OpportunityMatch> {
    return this.provider.computeOpportunityMatch(studentProfile, opportunity);
  }

  generateRecommendations(
    studentProfile: Record<string, unknown>,
    context: Record<string, unknown>,
  ): Promise<CareerRecommendation[]> {
    return this.provider.generateRecommendations(studentProfile, context);
  }
}
