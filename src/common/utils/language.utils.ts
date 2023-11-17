import { texts } from '../constants';
import { Target } from '../types';

export const getTextByLanguageCode = (
  languageCode: string,
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
