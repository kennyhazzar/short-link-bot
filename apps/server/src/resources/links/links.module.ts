import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { History } from './entities/history.entity';
import { Link } from './entities/link.entity';
import { BullModule } from '@nestjs/bull';
import { LinkConsumer } from './links.processor';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { RedisClientOptions } from 'redis';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfig, HttpConfig } from '../../core/index';
import { PreviewConsumer } from './preview.processor';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Link, History]),
    BullModule.registerQueueAsync({ name: 'link_queue' }),
    BullModule.registerQueueAsync({ name: 'preview_queue' }),
    CacheModule.registerAsync<RedisClientOptions>(CacheConfig),
    HttpModule.registerAsync(HttpConfig),
    ConfigModule,
    UsersModule,
  ],
  controllers: [LinksController],
  providers: [LinksService, LinkConsumer, PreviewConsumer],
  exports: [LinksService],
})
export class LinksModule {}
