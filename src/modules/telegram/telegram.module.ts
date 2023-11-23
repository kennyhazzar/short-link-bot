import { Module } from '@nestjs/common';
import { ActionsUpdate, MainUpdate, TextUpdate } from './updates';
import { UsersModule } from '@resource/users/users.module';
import { LinksModule } from '@resource/links/links.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    UsersModule,
    LinksModule,
    ConfigModule,
    BullModule.registerQueueAsync({ name: 'link_queue' }),
    BullModule.registerQueueAsync({ name: 'preview_queue' }),
  ],
  providers: [MainUpdate, TextUpdate, ActionsUpdate],
})
export class TelegramModule {}
