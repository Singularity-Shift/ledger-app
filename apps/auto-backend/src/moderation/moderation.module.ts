import { Module } from '@nestjs/common';
import { ModerationController } from './moderation.controller';
import { ModerationService } from './moderation.service';
import { AuthModule } from '../auth/auth.module';
import { GPTModule } from '../gpt/gpt.module';

@Module({
  imports: [AuthModule, GPTModule],
  controllers: [ModerationController],
  providers: [ModerationService],
})
export class ModerationModule {}
