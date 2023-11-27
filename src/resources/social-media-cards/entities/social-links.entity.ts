import { BaseEntity } from '@core/db';
import { Column } from 'typeorm';

export class SocialLinks extends BaseEntity {
  @Column({ type: 'enum' })
  type: string;
}
