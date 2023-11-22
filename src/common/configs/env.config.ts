import { registerAs, ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

const common = registerAs('common', () => ({
  port: +process.env.PORT,
  appUrl: process.env.APP_URL,
}));

const database = registerAs('db', () => ({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
}));

const ipwhois = registerAs('ipwhois', () => ({
  url: process.env.IPWHOIS_URL,
}));

const telegram = registerAs('tg', () => ({
  token: process.env.BOT_TOKEN,
  url: process.env.BOT_URL,
}));

const redis = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
}));

const throttler = registerAs('throttler', () => ({
  ttl: +process.env.THROTTLE_TTL,
  limit: +process.env.THROTTLE_LIMIT,
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
    BOT_TOKEN: Joi.string().required(),
    BOT_URL: Joi.string().required(),
    APP_URL: Joi.string().required(),
    THROTTLE_TTL: Joi.number().required(),
    THROTTLE_LIMIT: Joi.number().required(),
  }),
  load: [common, database, redis, ipwhois, telegram, throttler],
};
