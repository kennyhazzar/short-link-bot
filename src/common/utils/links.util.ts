import QRCode from 'qrcode';
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

export const isUrlValid = (text: string): boolean => {
  try {
    new URL(text);
    return true;
  } catch (err) {
    return false;
  }
};

export const generateQR = async (text: string): Promise<Buffer> =>
  QRCode.toBuffer(text);
