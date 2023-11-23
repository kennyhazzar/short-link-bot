import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@core/index';
import { User } from '../../users/entities';

@Entity()
export class Auth extends BaseEntity {
  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ default: false })
  isRevoke: boolean;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.id)
  creator: User;
}
