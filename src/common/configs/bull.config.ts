import { BullModuleOptions, SharedBullAsyncConfiguration } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfigs } from '../types';

export const BullConfig: SharedBullAsyncConfiguration = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<BullModuleOptions> => {
    const { host, port } = configService.get<RedisConfigs>('redis');

    return {
      redis: {
        host,
        port,
      },
    };
  },
};
