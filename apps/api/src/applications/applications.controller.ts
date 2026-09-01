import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, ApplicationStatus } from '@prisma/client';

@ApiTags('applications')
@Controller({ path: 'applications', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get('my')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get current student applications' })
  getMyApplications(@CurrentUser() user: { id: string }) {
    return this.applicationsService.findByStudent(user.id);
  }

  @Get('recruiter')
  @Roles(UserRole.INDUSTRY, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get applications for recruiter opportunity postings' })
  getRecruiterApplications(
    @CurrentUser() user: { id: string },
    @Query('opportunityId') opportunityId?: string,
    @Query('status') status?: ApplicationStatus,
  ) {
    return this.applicationsService.findByRecruiter(user.id, opportunityId, status);
  }

  @Post()
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Apply for an opportunity' })
  apply(
    @CurrentUser() user: { id: string },
    @Body() body: { opportunityId: string; coverNote?: string },
  ) {
    return this.applicationsService.apply(user.id, body.opportunityId, body.coverNote);
  }

  @Patch(':id/status')
  @Roles(UserRole.INDUSTRY, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update candidate application status' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ApplicationStatus; reviewerNotes?: string },
  ) {
    return this.applicationsService.updateStatus(id, body.status, body.reviewerNotes);
  }
}
