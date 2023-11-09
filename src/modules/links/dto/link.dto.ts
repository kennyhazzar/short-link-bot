import { ApiProperty } from '@nestjs/swagger';
import {
  LINK_DICTIONARY,
  MAXIMUM_LINK_LENGTH,
  MINIMUM_LINK_LENGTH,
} from '../../../common/constants';
import { Link } from '../entities/link.entity';
import { Point } from 'geojson';
import { DetectorResult } from '../../../common';

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

export class JobHistoryDto {
  userAgent: string;
  detectorResult: DetectorResult;
  ip: string;
  link: Link;
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
