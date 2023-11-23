import { ApiProperty } from '@nestjs/swagger';
import {
  LINK_DICTIONARY,
  MAXIMUM_LINK_LENGTH,
  MINIMUM_LINK_LENGTH,
} from '@common/index';
import { Point } from 'geojson';

export class InsertLinkDto {
  @ApiProperty({
    name: 'url',
    description: 'Оригинальная ссылка',
    example: 'https://google.ru',
  })
  url: string;

  @ApiProperty({
    name: 'alias',
    description: `Идентификатор ссылки (словарь: ${LINK_DICTIONARY}).\nТакже можно задать свое значение. Максимальная длина своего значения: ${MAXIMUM_LINK_LENGTH}`,
    minimum: MINIMUM_LINK_LENGTH,
    maximum: MAXIMUM_LINK_LENGTH,
    example: 'JhLKJ',
  })
  alias?: string;

  @ApiProperty({
    name: 'ttl',
    description:
      'Время жизни ссылки (в секундах). По умолчанию не имеет ограничения',
    nullable: true,
    example: 3600,
  })
  ttl?: number;
}

export class UpdateHistoryDto {
  ip: string;
  userAgent: string;
  osName: string;
  osPlatform: string;
  osVersion: string;
  osFamily: string;
  point?: Point;
  country?: string;
  city?: string;
  type?: string;
}

export class UpdateLinkDto {
  url?: string | undefined;
  title?: string | undefined;
  siteName?: string | undefined;
  images?: string[] | undefined;
  mediaType?: string | undefined;
  contentType?: string | undefined;
  favicons?: string[] | undefined;
  description?: string | undefined;
  isSubscribe?: boolean | undefined;
}

export class MediaFiles {
  @ApiProperty({
    title: 'favicons',
    description: 'Список значков веб-страницы',
    isArray: true,
    type: String,
    example: ['https://somesite.com/favicon.ico'],
  })
  favicons: Array<string>;
  @ApiProperty({
    title: 'images',
    description: 'Список картинок',
    isArray: true,
    type: String,
    example: ['https://somesite.com/favicon.ico'],
  })
  images: Array<string>;
}

export class CacheMediaFiles {
  telegramId: number;
  alias: string;
}
