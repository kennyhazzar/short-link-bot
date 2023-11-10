import { CacheStore, Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { History } from './entities/history.entity';
import { Link } from './entities/link.entity';
import { BullModule } from '@nestjs/bull';
import { LinkConsumer } from './links.processor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { redisStore } from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { RedisConfigs, CACHE_USER_TTL } from '../../common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Link, History]),
    BullModule.registerQueueAsync({ name: 'link_queue' }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { host, port } = configService.get<RedisConfigs>('redis');

        return {
          store: (await redisStore({
            url: `redis://${host}:${port}`,
            ttl: CACHE_USER_TTL,
          })) as unknown as CacheStore,
        };
      },
    }),
    ConfigModule,
    UsersModule,
  ],
  controllers: [LinksController],
  providers: [LinksService, LinkConsumer],
  exports: [LinksService],
})
export class LinksModule {}
