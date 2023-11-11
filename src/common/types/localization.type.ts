export type Target = 'start' | 'short_link_result' | 'validation_error';

export class Localization {
  target: Target;
  ru: string;
  en: string;
}
