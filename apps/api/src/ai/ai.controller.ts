import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

class AskCopilotDto {
  @IsString()
  message!: string;

  @IsOptional()
  question?: string;

  @IsOptional()
  context?: Record<string, unknown>;
}

@ApiTags('ai')
@Controller({ path: 'ai', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private aiService: AiService) {}

  @Public()
  @Get('status')
  @ApiOperation({ summary: 'Get AI provider status (demo vs live)' })
  getStatus() {
    return {
      isDemoMode: this.aiService.isDemoMode,
      providerName: this.aiService.providerName,
      message: this.aiService.isDemoMode
        ? 'AI is running in demo mode. Set AI_PROVIDER=ollama or GEMINI_API_KEY for live AI.'
        : `AI is running with ${this.aiService.providerName}.`,
    };
  }

  @Public()
  @Post('copilot')
  @ApiOperation({ summary: 'Ask the AI Career Copilot a question' })
  async askCopilot(
    @Body() dto: AskCopilotDto,
    @CurrentUser() user?: { id: string; role: string },
  ) {
    const userPrompt = dto.message || dto.question || 'What skills should I prioritize learning?';
    const response = await this.aiService.generateText(userPrompt, {
      systemPrompt: `You are SkillSync AI Career Copilot. The user is a ${user?.role || 'student'}. 
      Provide actionable, personalized career guidance. Focus on skills, learning roadmaps, and career growth.`,
    });

    return {
      response,
      isDemo: this.aiService.isDemoMode,
      provider: this.aiService.providerName,
    };
  }

  @Public()
  @Post('extract-skills')
  @ApiOperation({ summary: 'Extract skills from provided text (resume/description)' })
  async extractSkills(
    @Body() dto: { text: string; context?: string },
  ) {
    const skills = await this.aiService.extractSkills(dto.text, dto.context);
    return {
      skills,
      count: skills.length,
      isDemo: this.aiService.isDemoMode,
    };
  }
}
