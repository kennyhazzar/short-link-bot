import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { LanguageCode } from '../types';
import { getLanguageByCode, getTextByLanguageCode } from '../utils';
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

export const showMediaGroupMenu = (
  languageCode: LanguageCode,
  alias: string,
): ExtraReplyMessage => ({
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: getTextByLanguageCode(languageCode, 'show_link_media'),
          callback_data: `${ACTIONS.showMedia}${alias}`,
        },
      ],
    ],
  },
  parse_mode: 'Markdown',
});

const getLanguageButtonText = (
  languageCode: LanguageCode,
  targetLanguageCode: LanguageCode,
  text: string,
) => {
  const dot = languageCode === targetLanguageCode ? '•' : '';

  return `${dot} ${text} ${dot}`;
};
