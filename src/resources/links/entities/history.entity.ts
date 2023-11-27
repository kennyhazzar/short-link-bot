import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { HistoryBaseEntity } from '@core/index';
import { ApiProperty } from '@nestjs/swagger';
import { Link } from './link.entity';

@Entity()
export class History extends HistoryBaseEntity {
  @ApiProperty({
    name: 'link',
    description: 'Объект ссылки. Связь с таблицей Link как Многие-К-Одному',
    type: Link,
  })
  @JoinColumn()
  @ManyToOne(() => Link, (link) => link.id)
  link?: Link;
}
