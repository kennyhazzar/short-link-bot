import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { LanguageCode } from '../types';
import { getLanguageByCode, getTextByLanguageCode } from '../utils';
import { ACTIONS } from './telegram.constants';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { Chars } from './chars.constants';
import { Link } from '@resource/links/entities/link.entity';

export const languageMenu = (
  languageCode: LanguageCode,
): ExtraReplyMessage => ({
  reply_markup: {
    inline_keyboard: languageInlineKeyboard(languageCode),
  },
});

export const languageInlineKeyboard = (
  languageCode: LanguageCode,
): InlineKeyboardButton[][] => [
  [
    {
      text: getLanguageButtonText(
        languageCode,
        'ru',
        getLanguageByCode('ru')[languageCode],
      ),
      callback_data: `${ACTIONS.setLanguage}ru`,
    },
  ],
  [
    {
      text: getLanguageButtonText(
        languageCode,
        'en',
        getLanguageByCode('en')[languageCode],
      ),
      callback_data: `${ACTIONS.setLanguage}en`,
    },
  ],
];

export const showLinkInfoMenu = (
  languageCode: LanguageCode,
  link: Link,
): ExtraReplyMessage => ({
  reply_markup: {
    inline_keyboard: showLinkInfoInlineKeyboard(languageCode, link),
  },
  parse_mode: 'Markdown',
});

export const showLinkInfoInlineKeyboard = (
  languageCode: LanguageCode,
  { alias, isSubscribe }: Link,
): InlineKeyboardButton[][] => [
  [
    {
      text: getTextByLanguageCode(languageCode, 'show_link_media'),
      callback_data: `${ACTIONS.showMedia}${alias}`,
    },
  ],
  [
    {
      text: getTextByLanguageCode(
        languageCode,
        isSubscribe ? 'subscribe_button_no' : 'subscribe_button_yes',
      ),
      callback_data: `${ACTIONS.setSubscribe}${alias}`,
    },
  ],
];

const getLanguageButtonText = (
  languageCode: LanguageCode,
  targetLanguageCode: LanguageCode,
  text: string,
) => {
  const dot = languageCode === targetLanguageCode ? Chars.DOT : '';

  return `${dot} ${text} ${dot}`;
};
