import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('students')
@Controller({ path: 'students', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get('dashboard')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get student dashboard data' })
  getDashboard(@CurrentUser() user: { id: string }) {
    return this.studentsService.getDashboard(user.id);
  }

  @Get('profile')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get own student profile' })
  getOwnProfile(@CurrentUser() user: { id: string }) {
    return this.studentsService.getProfile(user.id);
  }

  @Put('profile')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Update student profile' })
  updateProfile(
    @CurrentUser() user: { id: string },
    @Body() data: {
      bio?: string;
      phone?: string;
      city?: string;
      state?: string;
      linkedinUrl?: string;
      githubUrl?: string;
      portfolioUrl?: string;
    },
  ) {
    return this.studentsService.updateProfile(user.id, data);
  }

  @Get(':id/profile')
  @Roles(UserRole.INDUSTRY, UserRole.INSTITUTION_ADMIN, UserRole.PLACEMENT_OFFICER, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get student profile by ID (for recruiters/institution)' })
  getProfile(@Param('id') id: string) {
    return this.studentsService.getProfileByStudentId(id);
  }

  @Post('skill-gaps/analyze')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Compute skill gaps for a target role' })
  analyzeSkillGaps(
    @CurrentUser() user: { id: string },
    @Body() body: { targetRole: string; studentId?: string },
  ) {
    // Security: students can only analyze their own gaps
    return this.studentsService.computeSkillGaps(body.studentId || user.id, body.targetRole);
  }

  @Get('skill-gaps')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get student skill gaps' })
  async getSkillGaps(@CurrentUser() user: { id: string }) {
    const profile = await this.studentsService.getProfile(user.id);
    return this.studentsService.getSkillGaps(profile.id);
  }

  @Get('readiness')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get placement readiness score' })
  async getReadiness(@CurrentUser() user: { id: string }) {
    const profile = await this.studentsService.getProfile(user.id);
    const score = await this.studentsService.computePlacementReadiness(profile.id);
    return { score, label: this.readinessLabel(score) };
  }

  private readinessLabel(score: number): string {
    if (score >= 80) return 'Placement Ready';
    if (score >= 60) return 'Almost Ready';
    if (score >= 40) return 'In Progress';
    return 'Getting Started';
  }
}
