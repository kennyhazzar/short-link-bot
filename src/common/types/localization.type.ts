export type Target =
  | 'start'
  | 'short_link_result'
  | 'validation_error'
  | 'stats'
  | 'stats_error_link_does_not_found'
  | 'link_not_found'
  | 'create_token'
  | 'revoke_token'
  | 'token';

export class Localization {
  target: Target;
  ru: string;
  en: string;
}
