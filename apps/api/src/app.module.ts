import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { SkillsModule } from './skills/skills.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { ApplicationsModule } from './applications/applications.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DocumentsModule } from './documents/documents.module';
import { InternshipsModule } from './internships/internships.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Configuration — validated at startup
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env.local', '.env'],
      validate: validateEnv,
      cache: true,
    }),

    // Rate limiting — 100 req/min per IP
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Cron jobs
    ScheduleModule.forRoot(),

    // Core modules
    PrismaModule,
    AuthModule,
    AiModule,

    // Domain modules
    UsersModule,
    StudentsModule,
    SkillsModule,
    OpportunitiesModule,
    ApplicationsModule,
    OrganizationsModule,
    InstitutionsModule,
    AssessmentsModule,
    RecommendationsModule,
    AnalyticsModule,
    NotificationsModule,
    DocumentsModule,
    InternshipsModule,
    AdminModule,
    HealthModule,
  ],
  providers: [
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
