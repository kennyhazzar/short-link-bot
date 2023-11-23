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
