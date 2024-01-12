import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DatabaseConfigs } from '../types';
import { join } from 'path';

export const TypeormConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<unknown> => {
    const {
      type,
      host,
      port,
      username,
      password,
      name: database,
    } = configService.get<DatabaseConfigs>('db');

    return {
      type,
      host,
      port,
      username,
      password,
      database,
      logging: configService.get('env.type') === 'development',
      entities: [join(__dirname, '../../', '/**/*.entity.{js,ts}')],
      synchronize: true,
      autoLoadEntities: true,
    };
  },
  inject: [ConfigService],
};
