import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { APP_GUARD } from '@nestjs/core';
import { AutoModule } from './auto/auto.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { ModerationModule } from './moderation/moderation.module';

@Module({
  imports: [ConfigModule, AutoModule, AuthModule, ModerationModule],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
