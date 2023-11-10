import { Link } from '../../modules/links/entities/link.entity';
import { DetectorResult } from './detector.type';

export class JobHistory {
  userAgent: string;
  detectorResult: DetectorResult;
  ip: string;
  link: Link;
}

export class JobQRCode {
  url: string;
  telegramId: number;
}
