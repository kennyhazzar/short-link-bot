import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { Link } from '@resource/links/entities/link.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { CacheConfig } from '@common/index';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Link]),
    CacheModule.registerAsync<RedisClientOptions>(CacheConfig),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
