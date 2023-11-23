import { Request } from 'express';
import { TrackerInfo } from '..';

export const getNetworkTrackerInfo = (request: Request): TrackerInfo => ({
  userAgent: request.headers['user-agent'] || '',
  ip:
    (request.headers['x-real-ip'] as string) ||
    (request.headers['x-forwarded-for'] as string) ||
    '',
});
