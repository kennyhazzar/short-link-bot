import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { LinkBaseEntity } from '@core/index';
import { History } from './history.entity';
import { User } from '@resource/users/entities';

@Entity()
export class Link extends LinkBaseEntity {
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
