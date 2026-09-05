import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('recommendations')
@Controller({ path: 'recommendations', version: '1' })
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @Get('health')
  health() {
    return { module: 'recommendations', status: 'ok' };
  }

  @Get('personalized')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personalized recommendations (opportunities, courses, mentors) for student' })
  async getPersonalizedRecommendations(@CurrentUser() user: { id: string }) {
    return this.recommendationsService.getRecommendationsForStudent(user.id);
  }

  @Get('match/:opportunityId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Compute explainable match score for opportunity' })
  async getOpportunityMatch(
    @CurrentUser() user: { id: string },
    @Param('opportunityId') opportunityId: string,
  ) {
    return this.recommendationsService.computeOpportunityMatch(user.id, opportunityId);
  }
}

