import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { MainUpdate, TextUpdate } from './updates';
import { UsersModule } from '../users/users.module';
import { LinksModule } from '../links/links.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, LinksModule, ConfigModule],
  providers: [TelegramService, MainUpdate, TextUpdate],
})
export class TelegramModule {}
