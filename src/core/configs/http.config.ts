import { HttpModuleAsyncOptions } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpConfigs } from '@core/types';

export const HttpConfig: HttpModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const { maxRedirects, timeout } = configService.get<HttpConfigs>('http');

    return {
      maxRedirects,
      timeout,
    };
  },
};
