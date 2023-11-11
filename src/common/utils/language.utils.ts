import { texts } from '../constants';
import { Target } from '../types';

export const getTextByLanguageCode = (
  languageCode: string,
  userTarget: Target,
): string => {
  if (languageCode === 'ru') {
    return texts.find(({ target }) => target === userTarget).ru;
  } else {
    return texts.find(({ target }) => target === userTarget).en;
  }
};
