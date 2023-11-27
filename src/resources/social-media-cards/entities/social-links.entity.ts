import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SocialType } from '@core/types';
import { LinkBaseEntity } from '@core/db';
import { SocialLinkHistory } from './social-links-history.entity';
import { MediaCard } from './media-card.entity';

@Entity()
export class SocialLink extends LinkBaseEntity {
  @Column({ type: 'enum', enum: SocialType })
  type: SocialType;

  @Column()
  socialSummary: string;

  @Column({ nullable: true })
  socialDescription?: string;

  @Column({ default: 0 })
  mediaRedirectCount: number;

  @JoinColumn()
  @OneToMany(() => SocialLinkHistory, (history) => history.id)
  history: SocialLinkHistory[];

  @JoinColumn()
  @ManyToOne(() => MediaCard, (card) => card.id)
  mediaCard: MediaCard;
}
