import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @ApiProperty({
    name: 'id',
    description: 'Первичный ключ',
    example: '10effc67-06db-42b2-a604-0ee4d0b76bde',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    name: 'createdAt',
    description: 'Дата создания',
    example: new Date().toISOString(),
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    name: 'updatedAt',
    description: 'Дата последнего обновления',
    example: new Date().toISOString(),
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
