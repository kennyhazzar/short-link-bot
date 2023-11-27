import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { HistoryBaseEntity } from '@core/db';
import { SocialLink } from './social-links.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class SocialLinkHistory extends HistoryBaseEntity {
  @ApiProperty({
    name: 'link',
    description: 'Объект ссылки. Связь с таблицей Link как Многие-К-Одному',
    type: SocialLink,
  })
  @JoinColumn()
  @ManyToOne(() => SocialLink, (link) => link.id)
  link?: SocialLink;
}
