import { Link } from '@resource/links/entities/link.entity';

export class JobHistory {
  userAgent: string;
  ip: string;
  link?: Link;
  isAdmin?: boolean;
}

export class JobSendAliasLink {
  shortLink: string;
  originalLink: string;
  telegramId: number;
  languageCode: string;
}

export class JobGetLinkPreview {
  url: string;
  alias: string;
  languageCode?: string;
}
