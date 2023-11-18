import QRCode from 'qrcode';
import { LINK_DICTIONARY, MINIMUM_LINK_LENGTH } from '../constants';
import { Message, MessageEntity } from 'telegraf/typings/core/types/typegram';

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

const composeUrl = (message: Message.TextMessage, entity: MessageEntity) => {
  const url = message.text.slice(entity.offset);
  if (url.startsWith('http')) {
    return url;
  } else {
    return 'https://' + url;
  }
};

export const getValidUrlByTelegramUserMessage = (
  message: Message.TextMessage,
): string | undefined => {
  if (message.entities && message.entities.length === 1) {
    const entity = message.entities[0];
    if (entity.type === 'url') {
      return composeUrl(message, entity);
    }
  }
};

export const getValidUrlByMessageForSubscribeCommand = (
  message: Message.TextMessage,
): string | undefined => {
  if (message.entities) {
    const entity = message.entities.find(({ type }) => type === 'url');
    if (entity) {
      return composeUrl(message, entity);
    }
  }
};

export const generateQR = async (text: string): Promise<Buffer> =>
  QRCode.toBuffer(text, {
    scale: 10,
  });
