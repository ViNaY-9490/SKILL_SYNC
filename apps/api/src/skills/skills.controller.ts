import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('skills')
@Controller({ path: 'skills', version: '1' })
export class SkillsController {
  constructor(private skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'List skills with search and pagination' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.skillsService.findAll({ search, categoryId, page, limit });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get skill taxonomy categories' })
  getCategories() {
    return this.skillsService.getCategories();
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending skills by industry demand' })
  @ApiQuery({ name: 'limit', required: false })
  getTrending(@Query('limit') limit?: number) {
    return this.skillsService.getTrendingSkills(limit);
  }

  @Get('demand')
  @ApiOperation({ summary: 'Get skill demand analytics from opportunities' })
  getDemand() {
    return this.skillsService.getSkillDemand();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get skill detail with relationships' })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Get(':id/graph')
  @ApiOperation({ summary: 'Get skill relationship graph' })
  getGraph(@Param('id') id: string) {
    return this.skillsService.getSkillGraph(id);
  }
}
