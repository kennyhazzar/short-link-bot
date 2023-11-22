import { Localization } from '../../types';

export const texts: Localization[] = [
  {
    target: 'start',
    ru: 'Добро пожаловать! Здесь вы можете создавать короткие ссылки. Ссылки сохраняют количество переходов, а также ведут историю переходов с подробной информацией. Но в данный момент это не отображается.\n1. Чтобы создать ссылку, просто отправьте ее текстом\n2. Чтобы посмотреть количество переходов по ссылке, отправьте короткую версию ссылки\n3. Воспользуйтесь командой /sub для получения инструкций по отслеживанию переходов по ссылкам\nРазработчик: @kennyhazzar',
    en: 'Welcome! Here you can create short links. Links store the number of clicks and also provide a click history with detailed information. But this is not displayed at the moment.\n1. To create a link, simply edit its text\n2. To see the number of clicks on a link, edit the short version of the link\n3. Use the /sub command for instructions on how to track redirects history in real-time\nDeveloper: @kennyhazzar',
  },
  {
    target: 'sub_help',
    ru: 'С помощью команды /sub <short-url> вы можете подписаться или отписаться на переходы по ссылке. Т.е. при переходе по ссылке, вы будете получать уведомления о переходе',
    en: 'Using the command /sub <short-url> you can subscribe or unsubscribe to clicks. When you follow a link, you will receive notifications about the redirects',
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
    target: 'link_info',
    ru: 'Заголовок: `%title%`\nОписание: `%description%`\nДата создания: `%createdAt%`\nОригинальная ссылка: `%originalLink%`\nКороткая версия: `%shortLink%`\nКоличество переходов: %redirectCount%\nПодписка: %isSubscribe%',
    en: 'Title: `%title%`\nDescription: `%description%`\nDate of creation: `%createdAt%`\nOriginal link: `%originalLink%`\nShort version: `%shortLink%`\nRedirect count on the link: %redirectCount%\nSubscribe: %isSubscribe%',
  },
  {
    target: 'stats_error_link_does_not_found',
    ru: 'Ссылка не найдена',
    en: 'Link not found',
  },
  {
    target: 'link_not_found',
    ru: 'Ссылка `%link%` не найдена',
    en: 'Link `%link%` not found',
  },
  {
    target: 'create_token',
    ru: 'Ваш токен: `%token%`. Используйте заголовок authorization при запросах.\nДокументация: https://srlk.ru/docs',
    en: 'Your token: `%token%`. Use the authorization header when making requests.\nDocumentation: https://srlk.ru/docs',
  },
  {
    target: 'revoke_token',
    ru: 'Токен `%token%` был отозван',
    en: 'Token `%token%` has been revoked',
  },
  {
    target: 'token',
    ru: 'Твой токен: %token%. Используй его для работы с API. Чтобы отозвать токен, используй команду /revoke',
    en: 'Your token: %token%. Use it to work with the API. To revoke a token, use /revoke',
  },
  {
    target: 'wrong_app_url_on_subscribe',
    ru: 'В вашей ссылке нет нашего домена. Перепроверьте ссылку и отправьте еще раз',
    en: 'Your link does not contain our domain. Please double check the link and submit again',
  },
  {
    target: 'subscribe_true',
    ru: 'Вы успешно подписались на обновления ссылки `%link%`',
    en: 'You have successfully subscribed to `%link%` updates',
  },
  {
    target: 'subscribe_false',
    ru: 'Вы успешно отписались от обновлений на ссылку `%link%`',
    en: 'You have successfully unsubscribed to `%link%` updates',
  },
  {
    target: 'new_redirect',
    ru: 'По вашей ссылке прошли!\n🗺️ Место: `%city%`, `%country%` (IP = `%ip%`)\n📱💻 Устройство: `%userAgent%`\n🔗 Ссылка: `%link%`',
    en: 'New click!\n🗺️ Location: `%city%`, `%country%` (IP = `%ip%`)\n📱💻 Device: `%userAgent%`\n🔗 Link: `%link%`',
  },
  {
    target: 'language',
    ru: 'Текущий язык помечен точками. Выбирайте язык нажатием кнопки. Текущий язык: %code%',
    en: 'The current language is marked with a dots. Select your language at the touch of a button. Current language: %code%',
  },
  {
    target: 'language_error_current_choice',
    ru: 'Вы уже выбрали этот язык',
    en: 'You have already selected this language',
  },
  {
    target: 'show_link_media',
    ru: 'Показать медиа-файлы (бета)',
    en: 'Show media-files (beta)',
  },
  {
    target: 'show_link_media_not_found',
    ru: 'Оказывается, медиа-файлов нет!',
    en: 'We do not found any media-files!',
  },
  {
    target: 'show_link_media_error',
    ru: 'Ошибка при получении медиа-файлов. Скорее всего их нет',
    en: "Error while receiving media files. Most likely they don't exist",
  },
  {
    target: 'show_link_media_success',
    ru: 'Оригинальные ссылки изображений находятся в подписях изображений',
    en: 'Original image links are in the image captions',
  },
  {
    target: 'yes_particle',
    ru: 'Да',
    en: 'Yes',
  },
  {
    target: 'no_particle',
    ru: 'Нет',
    en: 'No',
  },
];
