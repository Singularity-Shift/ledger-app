import { Module } from '@nestjs/common';
import { AutoController } from './auto.controller';
import { AutoService } from './auto.service';
import { AuthModule } from '../auth/auth.module';
import { ServerAccountModule } from '../server-account/sever-account.module';
import { GPTModule } from '../gpt/gpt.module';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [AuthModule, GPTModule, ServerAccountModule, ConfigModule],
  controllers: [AutoController],
  providers: [AutoService],
})
export class AutoModule {}
