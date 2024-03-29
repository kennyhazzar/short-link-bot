import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { LanguageCode } from '../types';
import { getLanguageByCode, getTextByLanguageCode } from '../utils';
import { ACTIONS } from './telegram.constants';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { Chars } from './chars.constants';
import { Link } from '../../resources/links/entities/link.entity';

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

export const linkInfoShowMediaButton = (
  languageCode: LanguageCode,
  alias: string,
): InlineKeyboardButton[] => [
  {
    text: getTextByLanguageCode(languageCode, 'show_link_media'),
    callback_data: `${ACTIONS.showMedia}${alias}`,
  },
];

export const linkInfoSubscribeButton = (
  languageCode: LanguageCode,
  alias: string,
  isSubscribe: boolean,
): InlineKeyboardButton[] => [
  {
    text: getTextByLanguageCode(
      languageCode,
      isSubscribe ? 'subscribe_button_no' : 'subscribe_button_yes',
    ),
    callback_data: `${ACTIONS.setSubscribe}${alias}_${isSubscribe}`,
  },
];

export const showLinkInfoInlineKeyboard = (
  languageCode: LanguageCode,
  { alias, isSubscribe }: Link,
): InlineKeyboardButton[][] => [
  // linkInfoShowMediaButton(languageCode, alias), // TODO: Разобраться че с этим делать))
  linkInfoSubscribeButton(languageCode, alias, isSubscribe),
];

const getLanguageButtonText = (
  languageCode: LanguageCode,
  targetLanguageCode: LanguageCode,
  text: string,
) => {
  const dot = languageCode === targetLanguageCode ? Chars.DOT : '';

  return `${dot} ${text} ${dot}`;
};
