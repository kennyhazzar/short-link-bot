import { Link } from '@resource/links/entities/link.entity';
import { texts } from '../constants';
import { LanguageCode, Target } from '../types';

export const getTextByLanguageCode = (
  languageCode: LanguageCode,
  userTarget: Target,
  wordsToReplace?: Record<string, string>,
): string => {
  let result: string;

  if (languageCode === 'ru') {
    result = texts.find(({ target }) => target === userTarget).ru;
  } else {
    result = texts.find(({ target }) => target === userTarget).en;
  }

  if (wordsToReplace) {
    for (const definition in wordsToReplace) {
      result = result.replace(`%${definition}%`, wordsToReplace[definition]);
    }
  }

  return result;
};

export const getLanguageByCode = (languageCode: LanguageCode) => {
  const texts: Record<LanguageCode, { ru: string; en: string }> = {
    ru: { ru: 'Русский', en: 'Russian' },
    en: { ru: 'Английский', en: 'English' },
  };

  return texts[languageCode];
};

export const getLinkInformationText = (
  languageCode: LanguageCode,
  link: Link,
  appUrl: string,
) =>
  getTextByLanguageCode(languageCode, 'link_info', {
    title:
      link.title ||
      getTextByLanguageCode(languageCode, 'property_value_not_found'),
    description:
      link.description ||
      getTextByLanguageCode(languageCode, 'property_value_not_found'),
    createdAt: link.createdAt.toISOString(),
    originalLink: link.url,
    shortLink: `${appUrl}/${link.alias}`,
    redirectCount: String(link.redirectsCount),
    isSubscribe: getTextByLanguageCode(
      languageCode,
      link.isSubscribe ? 'yes_particle' : 'no_particle',
    ),
  });
