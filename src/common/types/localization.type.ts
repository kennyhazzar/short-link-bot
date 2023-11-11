export type Target =
  | 'start'
  | 'short_link_result'
  | 'validation_error'
  | 'stats'
  | 'stats_error_link_does_not_found';

export class Localization {
  target: Target;
  ru: string;
  en: string;
}
