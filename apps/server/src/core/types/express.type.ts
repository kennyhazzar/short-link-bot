import { Request } from 'express';
import { User } from '../../resources/users/entities';

export interface AuthRequest extends Request {
  user: User;
}

export interface TrackerInfo {
  ip: string;
  userAgent: string;
}
