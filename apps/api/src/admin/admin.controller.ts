import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, UserStatus } from '@prisma/client';

@ApiTags('admin')
@Controller({ path: 'admin', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'List platform users with filtering' })
  getUsers(
    @Query('role') role?: UserRole,
    @Query('status') status?: UserStatus,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(role, status, search);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user account status (Activate/Suspend)' })
  updateUserStatus(
    @Param('id') id: string,
    @Body() body: { status: UserStatus },
  ) {
    return this.adminService.updateUserStatus(id, body.status);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'List platform audit logs' })
  getAuditLogs(@Query('action') action?: string) {
    return this.adminService.getAuditLogs(action);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get high-level platform administration stats' })
  getPlatformStats() {
    return this.adminService.getPlatformStats();
  }
}
