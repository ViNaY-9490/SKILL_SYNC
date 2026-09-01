import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InstitutionsService } from './institutions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('institutions')
@Controller({ path: 'institutions', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InstitutionsController {
  constructor(private institutionsService: InstitutionsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all academic institutions' })
  findAll() {
    return this.institutionsService.findAll();
  }

  @Get('students')
  @Roles(UserRole.INSTITUTION_ADMIN, UserRole.PLACEMENT_OFFICER, UserRole.FACULTY, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get student roster for institution' })
  getStudents(@CurrentUser() user: { id: string }) {
    return this.institutionsService.getStudents(user.id);
  }

  @Get('skill-matrix')
  @Roles(UserRole.INSTITUTION_ADMIN, UserRole.PLACEMENT_OFFICER, UserRole.FACULTY, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get institutional curriculum vs industry skill gap matrix' })
  getSkillMatrix() {
    return this.institutionsService.getSkillMatrix();
  }

  @Get('placements')
  @Roles(UserRole.INSTITUTION_ADMIN, UserRole.PLACEMENT_OFFICER, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get placement drive statistics' })
  getPlacementDriveStats() {
    return this.institutionsService.getPlacementDriveStats();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get institution by ID' })
  findOne(@Param('id') id: string) {
    return this.institutionsService.findOne(id);
  }
}
