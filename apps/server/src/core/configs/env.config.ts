import { registerAs, ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';
import {
  CommonConfigs,
  DatabaseConfigs,
  HttpConfigs,
  IpwhoisConfigs,
  RedisConfigs,
  TelegrafConfigs,
  ThrottlerConfigs,
} from '../types';

const common = registerAs<CommonConfigs>('common', () => ({
  port: +process.env.PORT,
  appUrl: process.env.APP_URL,
}));

const database = registerAs<DatabaseConfigs>('db', () => ({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
}));

const ipwhois = registerAs<IpwhoisConfigs>('ipwhois', () => ({
  url: process.env.IPWHOIS_URL,
}));

const telegram = registerAs<TelegrafConfigs>('tg', () => ({
  adminTelegramId: +process.env.BOT_ADMIN_TELEGRAM_ID,
  token: process.env.BOT_TOKEN,
  url: process.env.BOT_URL,
}));

const redis = registerAs<RedisConfigs>('redis', () => ({
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
}));

const throttler = registerAs<ThrottlerConfigs>('throttler', () => ({
  ttl: +process.env.THROTTLE_TTL,
  limit: +process.env.THROTTLE_LIMIT,
}));

const http = registerAs<HttpConfigs>('http', () => ({
  timeout: +process.env.HTTP_TIMEOUT,
  maxRedirects: +process.env.HTTP_MAX_REDIRECTS,
}));

export const EnvConfig: ConfigModuleOptions = {
  envFilePath: '.env',
  isGlobal: true,
  validationSchema: Joi.object({
    PORT: Joi.string().required(),
    DB_TYPE: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    IPWHOIS_URL: Joi.string().required(),
    BOT_ADMIN_TELEGRAM_ID: Joi.number().required(),
    BOT_TOKEN: Joi.string().required(),
    BOT_URL: Joi.string().required(),
    APP_URL: Joi.string().required(),
    THROTTLE_TTL: Joi.number().required(),
    THROTTLE_LIMIT: Joi.number().required(),
    HTTP_TIMEOUT: Joi.number().required(),
    HTTP_MAX_REDIRECTS: Joi.number().required(),
  }),
  load: [common, database, redis, ipwhois, telegram, throttler, http],
};
