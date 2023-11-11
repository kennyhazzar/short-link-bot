import { Localization } from '../../types';

export const texts: Localization[] = [
  {
    target: 'start',
    ru: 'Добро пожаловать! Здесь вы можете создавать короткие ссылки. Ссылки сохраняют количество переходов, а также ведут историю переходов с подробной информацией. Но в данный момент это не отображается.\n1. Чтобы создать ссылку, просто отправьте ее текстом\n2. Чтобы посмотреть количество переходов по ссылке, отправьте короткую версию ссылки. Разработчик: @kennyhazzar',
    en: 'Welcome! Here you can create short links. Links store the number of clicks and also provide a click history with detailed information. But this is not displayed at the moment.\n1. To create a link, simply edit its text\n2. To see the number of clicks on a link, edit the short version of the link. Developer: @kennyhazzar',
  },
  {
    target: 'short_link_result',
    ru: 'Оригинальная ссылка: `%original%`\nКороткая ссылка: `%short%`',
    en: 'Original link: `%original%`\nShort link: `%short%`',
  },
  {
    target: 'validation_error',
    ru: 'Твоя ссылка невалидна. Проверь свою ссылку, и попробуй еще раз',
    en: 'Your link is invalid. Check your link and try again',
  },
  {
    target: 'stats',
    ru: 'Количество переходов по ссылке: ',
    en: 'Redirect count on the link: ',
  },
  {
    target: 'stats_error_link_does_not_found',
    ru: 'Ссылка не найдена',
    en: 'Link not found',
  },
];
