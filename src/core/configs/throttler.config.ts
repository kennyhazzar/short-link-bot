import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerAsyncOptions } from '@nestjs/throttler';
import { ThrottlerConfigs } from '../types';

export const ThrottlerConfig: ThrottlerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const { limit, ttl } = configService.get<ThrottlerConfigs>('throttler');

    return [
      {
        ttl,
        limit,
      },
    ];
  },
};
