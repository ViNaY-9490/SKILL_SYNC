import { Module } from '@nestjs/common';
import { InternshipsController } from './internships.controller';
import { InternshipsService } from './internships.service';

@Module({
  controllers: [InternshipsController],
  providers: [InternshipsService],
  exports: [InternshipsService],
})
export class InternshipsModule {}
