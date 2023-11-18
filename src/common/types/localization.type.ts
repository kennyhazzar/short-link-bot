export type Target =
  | 'start'
  | 'short_link_result'
  | 'validation_error'
  | 'stats'
  | 'stats_error_link_does_not_found'
  | 'link_not_found'
  | 'create_token'
  | 'revoke_token'
  | 'token'
  | 'wrong_app_url_on_subscribe'
  | 'subscribe_true'
  | 'subscribe_false'
  | 'sub_help';

export class Localization {
  target: Target;
  ru: string;
  en: string;
}
