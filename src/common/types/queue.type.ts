import { Link } from '../../modules/links/entities/link.entity';

export class JobHistory {
  userAgent: string;
  ip: string;
  link: Link;
}

export class JobSendAliasLink {
  shortLink: string;
  originalLink: string;
  telegramId: number;
  languageCode: string;
}
