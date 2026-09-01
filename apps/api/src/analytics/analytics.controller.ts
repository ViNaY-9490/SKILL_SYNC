import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('analytics')
@Controller({ path: 'analytics', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('industry-demand')
  @Public()
  @ApiOperation({ summary: 'Get top in-demand skills in industry' })
  getIndustryDemand() {
    return this.analyticsService.getIndustryDemand();
  }

  @Get('skill-alignment')
  @Public()
  @ApiOperation({ summary: 'Get student-industry skill alignment overview' })
  getSkillAlignment() {
    return this.analyticsService.getSkillAlignment();
  }
}
