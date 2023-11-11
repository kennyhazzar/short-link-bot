import { CacheStore, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { Link } from '../links/entities/link.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CACHE_USER_TTL, RedisConfigs } from '../../common';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Link]),
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
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
