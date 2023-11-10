import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { MainUpdate } from './updates/main.update';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [TelegramService, MainUpdate],
})
export class TelegramModule {}
