import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OpportunitiesService } from './opportunities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, OpportunityType, WorkMode } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('opportunities')
@Controller({ path: 'opportunities', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OpportunitiesController {
  constructor(private opportunitiesService: OpportunitiesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List published opportunities with optional filters' })
  findAll(
    @Query('search') search?: string,
    @Query('type') type?: OpportunityType,
    @Query('workMode') workMode?: WorkMode,
    @Query('location') location?: string,
    @Query('organizationId') organizationId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.opportunitiesService.findAll({ search, type, workMode, location, organizationId, page, limit });
  }

  @Get('matched')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get AI-matched opportunities for current student' })
  async getMatched(@CurrentUser() user: { id: string }) {
    // Get student profile ID from user ID
    return this.opportunitiesService.getMatchedOpportunities(user.id);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get opportunity detail' })
  findOne(@Param('id') id: string) {
    return this.opportunitiesService.findOne(id);
  }

  @Post(':id/match')
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Compute match score for student vs opportunity' })
  async computeMatch(
    @Param('id') opportunityId: string,
    @Body() body: { studentId: string },
  ) {
    return this.opportunitiesService.computeMatchForStudent(opportunityId, body.studentId);
  }

  @Post()
  @Roles(UserRole.INDUSTRY, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new opportunity' })
  create(
    @Body() data: Parameters<typeof this.opportunitiesService.create>[0],
    @CurrentUser() user: { id: string },
  ) {
    return this.opportunitiesService.create({ ...data, createdById: user.id });
  }

  @Put(':id')
  @Roles(UserRole.INDUSTRY, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update an opportunity' })
  update(
    @Param('id') id: string,
    @Body() data: Parameters<typeof this.opportunitiesService.update>[2],
    @CurrentUser() user: { id: string; organizationId?: string },
  ) {
    return this.opportunitiesService.update(id, user.organizationId || '', data);
  }
}
