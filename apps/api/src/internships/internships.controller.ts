import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InternshipsService } from './internships.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('internships')
@Controller({ path: 'internships', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InternshipsController {
  constructor(private internshipsService: InternshipsService) {}

  @Get('my')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get current student internship workspace details' })
  getMyInternships(@CurrentUser() user: { id: string }) {
    return this.internshipsService.findStudentInternships(user.id);
  }

  @Get('mentor')
  @Roles(UserRole.INDUSTRY, UserRole.FACULTY, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get assigned internships for mentor review' })
  getMentorInternships(@CurrentUser() user: { id: string }) {
    return this.internshipsService.findMentorInternships(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full internship workspace by ID' })
  getInternshipDetails(@Param('id') id: string) {
    return this.internshipsService.getInternshipDetails(id);
  }

  @Post(':id/milestones/:milestoneId')
  @ApiOperation({ summary: 'Update milestone progress state' })
  updateMilestone(
    @Param('id') id: string,
    @Param('milestoneId') milestoneId: string,
    @Body() body: { completed: boolean; notes?: string },
  ) {
    return this.internshipsService.updateMilestone(id, milestoneId, body.completed, body.notes);
  }

  @Post(':id/feedback')
  @Roles(UserRole.INDUSTRY, UserRole.FACULTY, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Submit mentor evaluation and rating' })
  submitFeedback(
    @Param('id') id: string,
    @Body() body: { feedback: string; rating: number },
  ) {
    return this.internshipsService.submitMentorFeedback(id, body.feedback, body.rating);
  }
}
