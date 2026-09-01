import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssessmentsService } from './assessments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('assessments')
@Controller({ path: 'assessments', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AssessmentsController {
  constructor(private assessmentsService: AssessmentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all public skill assessments' })
  findAll() {
    return this.assessmentsService.findAll();
  }

  @Get('attempts/my')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'List student assessment attempts' })
  getMyAttempts(@CurrentUser() user: { id: string }) {
    return this.assessmentsService.findStudentAttempts(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assessment details with questions' })
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(id);
  }

  @Post(':id/start')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Start assessment attempt' })
  startAttempt(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.assessmentsService.startAttempt(user.id, id);
  }

  @Post('attempts/:attemptId/submit')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Submit assessment responses' })
  submitAttempt(
    @Param('attemptId') attemptId: string,
    @CurrentUser() user: { id: string },
    @Body() body: { answers: Array<{ questionId: string; response: any }>; timeSpent: number },
  ) {
    return this.assessmentsService.submitAttempt(attemptId, user.id, body.answers, body.timeSpent);
  }
}
