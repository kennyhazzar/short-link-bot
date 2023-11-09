import { LINK_DICTIONARY, MINIMUM_LINK_LENGTH } from '../constants';

export const generateId = (
  length = MINIMUM_LINK_LENGTH,
  dict = LINK_DICTIONARY,
) => {
  const a = dict.split('');
  const token = [];
  for (let i = 0; i < length; i++) {
    const instance = (Math.random() * (a.length - 1)).toFixed(0);
    token[i] = a[instance];
  }
  return token.join('');
};
