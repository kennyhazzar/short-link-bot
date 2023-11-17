import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../modules/users/entities/user.entity';
import {
  LINK_DICTIONARY,
  MAXIMUM_LINK_LENGTH,
  MINIMUM_LINK_LENGTH,
} from '../../../common/constants';
import { History } from './history.entity';

@Entity()
export class Link extends BaseEntity {
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
    name: 'description',
    description:
      'Описание ссылки. Можно отправить вместе с ссылкой через пробел',
    type: String,
  })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({
    name: 'creator',
    description:
      'Объект пользователя, который создал ссылку. В БД определяется как вторичный ключ к таблице User (Многие-К-Одному)',
    type: User,
  })
  @JoinColumn()
  @ManyToOne(() => User, (user) => user.id)
  creator?: User;

  @ApiProperty({
    name: 'history',
    description: 'История переходов по ссылке',
    isArray: true,
    type: History,
  })
  @JoinColumn()
  @OneToMany(() => History, (history) => history.id)
  history: History[];
}
