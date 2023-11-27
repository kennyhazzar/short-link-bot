import { BaseEntity } from '@core/db';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SocialLink } from './social-links.entity';
import { User } from '@resource/users/entities';

@Entity()
export class MediaCard extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  backgroundUrlImage?: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.id)
  creator: User;

  @JoinColumn()
  @OneToMany(() => SocialLink, (link) => link.id)
  links: SocialLink[];
}
