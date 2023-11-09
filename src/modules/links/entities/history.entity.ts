import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common';
import { ApiProperty } from '@nestjs/swagger';
import { Link } from './link.entity';

@Entity()
export class History extends BaseEntity {
  @ApiProperty({
    name: 'userAgent',
    description:
      'Пользовательский агент, устройство, ответственный за переход по ссылке',
  })
  @Column({ nullable: true })
  userAgent?: string;

  @ApiProperty({
    name: 'ipwhoisResponse',
    description:
      'Ответ от ipwhois. Хранение в формате JSON. https://ipwhois.io/ru/documentation',
  })
  @Column({ nullable: true, type: 'json' })
  ipwhoisResponse?: string;

  @ApiProperty({
    name: 'link',
    description: 'Объект ссылки. Связь с таблицей Link как Многие-К-Одному',
    type: Link,
  })
  @JoinColumn()
  @ManyToOne(() => Link, (link) => link.id)
  link?: Link;
}
