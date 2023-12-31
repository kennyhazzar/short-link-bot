export type Target =
  | 'start'
  | 'short_link_result'
  | 'validation_error'
  | 'link_info'
  | 'stats_error_link_does_not_found'
  | 'link_not_found'
  | 'create_token'
  | 'revoke_token'
  | 'token'
  | 'wrong_app_url_on_subscribe'
  | 'subscribe_true'
  | 'subscribe_false'
  | 'sub_help'
  | 'new_redirect'
  | 'language'
  | 'language_error_current_choice'
  | 'show_link_media'
  | 'show_link_media_error'
  | 'show_link_media_success'
  | 'yes_particle'
  | 'no_particle'
  | 'show_link_media_not_found'
  | 'property_value_not_found'
  | 'subscribe_button_yes'
  | 'subscribe_button_no'
  | 'subscribe_internal_error'
  | 'subscribe_already_action_error';

export type LanguageCode = 'ru' | 'en' | string;

export class Localization {
  target: Target;
  ru: string;
  en: string;
}
