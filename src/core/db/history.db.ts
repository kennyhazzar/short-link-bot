import { Column, Index } from 'typeorm';
import { BaseEntity } from './base.db';
import { ApiProperty } from '@nestjs/swagger';
import { Point } from 'geojson';

export abstract class HistoryBaseEntity extends BaseEntity {
  @ApiProperty({
    name: 'userAgent',
    description:
      'Пользовательский агент, устройство, ответственный за переход по ссылке',
  })
  @Column({ nullable: true, name: 'rawUserAgent' })
  userAgent?: string;

  @ApiProperty({
    name: 'point',
    nullable: true,
  })
  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  point?: Point;

  @ApiProperty({
    name: 'country',
    nullable: true,
  })
  @Column({ nullable: true })
  country?: string;

  @ApiProperty({
    name: 'city',
    nullable: true,
  })
  @Column({ nullable: true })
  city?: string;

  @ApiProperty({
    name: 'type',
    nullable: true,
  })
  type?: string;

  @ApiProperty({
    name: 'ip',
  })
  @Column({ nullable: true, type: 'inet' })
  ip?: string;

  @Column({ nullable: true })
  osName: string;

  @Column({ nullable: true })
  osPlatform: string;

  @Column({ nullable: true })
  osVersion: string;

  @Column({ nullable: true })
  osFamily: string;
}
