import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  BullConfig,
  EnvConfig,
  TelegrafConfig,
  ThrottlerConfig,
  TypeormConfig,
} from '../common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { LinksModule } from './links/links.module';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramModule } from './telegram/telegram.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(EnvConfig),
    TypeOrmModule.forRootAsync(TypeormConfig),
    BullModule.forRootAsync(BullConfig),
    TelegrafModule.forRootAsync(TelegrafConfig),
    ThrottlerModule.forRootAsync(ThrottlerConfig),
    BullModule.registerQueueAsync({ name: 'link_queue' }),
    UsersModule,
    LinksModule,
    TelegramModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
