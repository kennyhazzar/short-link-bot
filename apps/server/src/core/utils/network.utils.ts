import { Request } from 'express';
import { TrackerInfo } from '..';
import { userAgents } from '../constants/network';

export const getNetworkTrackerInfo = (request: Request): TrackerInfo => ({
  userAgent: request.headers['user-agent'] || '',
  ip:
    (request.headers['x-real-ip'] as string) ||
    (request.headers['x-forwarded-for'] as string) ||
    '',
});

export const getRandomUserAgent = (): string =>
  userAgents[Math.floor(Math.random() * userAgents.length)];
