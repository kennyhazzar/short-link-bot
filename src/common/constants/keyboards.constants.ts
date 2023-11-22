import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { LanguageCode } from '../types';
import { getLanguageByCode } from '../utils';
import { ACTIONS } from './telegram.constants';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

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
      text: `${getLanguageByCode('ru')[languageCode]}${
        languageCode === 'ru' ? '✓' : ''
      }`,
      callback_data: `${ACTIONS.setLanguage}ru`,
    },
  ],
  [
    {
      text: `${getLanguageByCode('en')[languageCode]}${
        languageCode === 'en' ? '✓' : ''
      }`,
      callback_data: `${ACTIONS.setLanguage}en`,
    },
  ],
];
