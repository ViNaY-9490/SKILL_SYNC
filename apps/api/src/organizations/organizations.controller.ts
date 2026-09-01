import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('organizations')
@Controller({ path: 'organizations', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all industry organizations' })
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get('profile/my')
  @Roles(UserRole.INDUSTRY)
  @ApiOperation({ summary: 'Get logged in recruiter profile' })
  getProfile(@CurrentUser() user: { id: string }) {
    return this.organizationsService.getProfile(user.id);
  }

  @Put('profile/my')
  @Roles(UserRole.INDUSTRY)
  @ApiOperation({ summary: 'Update recruiter profile' })
  updateProfile(@CurrentUser() user: { id: string }, @Body() data: any) {
    return this.organizationsService.updateProfile(user.id, data);
  }

  @Get('candidates/search')
  @Roles(UserRole.INDUSTRY, UserRole.SUPER_ADMIN, UserRole.PLACEMENT_OFFICER)
  @ApiOperation({ summary: 'Search candidates by skills & readiness score' })
  searchCandidates(
    @Query('skills') skills?: string,
    @Query('minReadiness') minReadiness?: string,
  ) {
    const skillList = skills ? skills.split(',').map((s) => s.trim()) : undefined;
    const minScore = minReadiness ? parseFloat(minReadiness) : 0;
    return this.organizationsService.searchCandidates(skillList, minScore);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get organization details by ID' })
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }
}
