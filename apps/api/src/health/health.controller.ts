import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get('health')
  health() { return { module: 'health', status: 'ok' }; }
}
