import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { RedisClientOptions } from 'redis';
import { CacheConfig } from '../../core/index';
import { CacheModule } from '@nestjs/cache-manager';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Auth]),
    CacheModule.registerAsync<RedisClientOptions>(CacheConfig),
  ],
  providers: [AuthService, ApiKeyStrategy],
})
export class AuthModule {}
