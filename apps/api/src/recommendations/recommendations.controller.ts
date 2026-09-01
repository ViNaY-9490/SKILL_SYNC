import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';

@ApiTags('recommendations')
@Controller({ path: 'recommendations', version: '1' })
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @Get('health')
  health() { return { module: 'recommendations', status: 'ok' }; }
}
