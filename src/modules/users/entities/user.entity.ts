import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '@common/index';
import { ApiProperty } from '@nestjs/swagger';
import { Link } from '@resource/links/entities/link.entity';
import { Auth } from '@auth/entities';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({
    name: 'telegramId',
    description: 'Айди пользователя в Telegram',
    example: 5327383165,
  })
  @Index()
  @Column({ unique: true, type: 'bigint' })
  telegramId: number;

  @ApiProperty({
    name: 'username',
    description: 'Никнейм пользователя в Telegram',
    nullable: true,
    example: 5327383165,
  })
  @Column({ nullable: true, unique: true })
  username: string;

  @ApiProperty({
    name: 'email',
    description: 'Почта пользователя',
    nullable: true,
    example: 'someemail@email.com',
  })
  @Column({ nullable: true, unique: true })
  email: string;

  @ApiProperty({
    name: 'isEmailConfirm',
    description: 'Если почта пользователя подтверждена',
    default: false,
    example: false,
  })
  @Column({ default: false })
  isEmailConfirm: boolean;

  @ApiProperty({
    name: 'isActive',
    description: 'Если пользователь не заблокировал бота',
    default: true,
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    name: 'isBlocked',
    description: 'Если пользователь заблокирован ботом',
    default: false,
    example: false,
  })
  @Column({ default: false })
  isBlocked: boolean;

  @ApiProperty({
    name: 'unsubscribeAt',
    description:
      'Дата блокировка бота пользователем. Обязательное условие: isActive === true',
    nullable: true,
    example: new Date().toISOString(),
  })
  @Column({ nullable: true })
  unsubscribeAt: Date;

  @Column({ nullable: true })
  languageCode: string;

  @ApiProperty({
    name: 'link',
    description: 'Список ссылок, созданных пользователем',
    isArray: true,
    type: Link,
  })
  @JoinColumn()
  @OneToMany(() => Link, (link) => link.id)
  link: Link;

  @JoinColumn()
  @OneToOne(() => Auth, (auth) => auth.id)
  apiAuth: Auth;
}
