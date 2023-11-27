import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import {
  LINK_DICTIONARY,
  MAXIMUM_LINK_LENGTH,
  MINIMUM_LINK_LENGTH,
} from '../constants';
import { BaseEntity } from './base.db';

export abstract class LinkBaseEntity extends BaseEntity {
  @ApiProperty({
    name: 'url',
    description: 'Оригинальная ссылка',
    example: 'https://google.ru',
  })
  @Column()
  url: string;

  @ApiProperty({
    name: 'alias',
    description: `Идентификатор ссылки (словарь: ${LINK_DICTIONARY}).\nТакже можно задать свое значение. Максимальная длина своего значения: ${MAXIMUM_LINK_LENGTH}`,
    minimum: MINIMUM_LINK_LENGTH,
    maximum: MAXIMUM_LINK_LENGTH,
    example: 'JhLKJ',
  })
  @Column({ unique: true })
  alias: string;

  @ApiProperty({
    name: 'isDeleted',
    description: 'Если ссылка была удалена',
    default: false,
    example: false,
  })
  @Column({ default: false })
  isDeleted: boolean;

  @ApiProperty({
    name: 'ttl',
    description:
      'Время жизни ссылки (в секундах). По умолчанию не имеет ограничения',
    nullable: true,
    example: 3600,
  })
  @Column({ nullable: true })
  ttl?: number;

  @ApiProperty({
    name: 'redirectsCount',
    description:
      'Количество переходов по ссылке. Работает независимо от истории',
    default: 0,
    example: 120,
  })
  @Column({ default: 0 })
  redirectsCount: number;

  @ApiProperty({
    name: 'isSubscribe',
    description: 'Флаг подписки на переходы по ссылке',
    default: false,
    example: true,
  })
  @Column({ default: false })
  isSubscribe: boolean;

  @ApiProperty({
    name: 'title',
    description:
      'Заголовок сайта. Парсится автоматически после создания ссылки',
  })
  @Column({ nullable: true })
  title?: string;

  @ApiProperty({
    name: 'siteName',
    description: 'Название сайта. Парсится автоматически после создания ссылки',
  })
  @Column({ nullable: true })
  siteName?: string;

  @ApiProperty({
    name: 'images',
    description:
      'Картинки предпросмотра. Парсится автоматически после создания ссылки',
    isArray: true,
  })
  @Column({ type: 'text', nullable: true, array: true })
  images?: string[];

  @ApiProperty({
    name: 'mediaType',
    description: 'Тип медиа.  Парсится автоматически после создания ссылки',
  })
  @Column({ nullable: true })
  mediaType?: string;

  @ApiProperty({
    name: 'contentType',
    description: 'Тип контента. Парсится автоматически после создания ссылки',
  })
  @Column({ nullable: true })
  contentType?: string;

  @ApiProperty({
    name: 'favicons',
    description: 'Иконки сайта. Парсится автоматически после создания ссылки',
  })
  @Column({ type: 'text', nullable: true, array: true })
  favicons?: string[];

  @ApiProperty({
    name: 'description',
    description: 'Описание сайта. Парсится автоматически после создания ссылки',
  })
  @Column({ nullable: true })
  description?: string;
}
