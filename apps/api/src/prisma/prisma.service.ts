import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  public isConnected = false;

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: { url: configService.get<string>('DATABASE_URL') },
      },
      log: ['warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      console.log('✅ Connected to database');
    } catch (err) {
      this.isConnected = false;
      console.warn('⚠️ Could not connect to MongoDB database. API will run in Local Prototype mode.');
      console.warn('   Start MongoDB using `docker compose up -d` for live database access.');
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
    }
  }

  async cleanupExpiredTokens() {
    if (!this.isConnected) return;
    const cutoff = new Date();
    try {
      await this.refreshToken.deleteMany({
        where: {
          OR: [{ expiresAt: { lt: cutoff } }, { revokedAt: { not: null } }],
        },
      });
    } catch {
      // Ignore if DB not active
    }
  }
}
