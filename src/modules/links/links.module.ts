import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { History } from './entities/history.entity';
import { Link } from './entities/link.entity';
import { BullModule } from '@nestjs/bull';
import { LinkConsumer } from './links.processor';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { RedisClientOptions } from 'redis';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfig } from '../../common';
import { PreviewConsumer } from './preview.processor';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Link, History]),
    BullModule.registerQueueAsync({ name: 'link_queue' }),
    BullModule.registerQueueAsync({ name: 'preview_queue' }),
    CacheModule.registerAsync<RedisClientOptions>(CacheConfig),
    ConfigModule,
    UsersModule,
  ],
  controllers: [LinksController],
  providers: [
    LinksService,
    LinkConsumer,
    PreviewConsumer,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [LinksService],
})
export class LinksModule {}
