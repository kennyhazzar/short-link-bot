import { ApiProperty } from '@nestjs/swagger';
import {
  LINK_DICTIONARY,
  MAXIMUM_LINK_LENGTH,
  MINIMUM_LINK_LENGTH,
} from '../../../common/constants';

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
