import { Module } from '@nestjs/common';
import { MainUpdate, TextUpdate } from './updates';
import { UsersModule } from '../users/users.module';
import { LinksModule } from '../links/links.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    UsersModule,
    LinksModule,
    ConfigModule,
    BullModule.registerQueueAsync({ name: 'link_queue' }),
  ],
  providers: [MainUpdate, TextUpdate],
})
export class TelegramModule {}
