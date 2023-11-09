import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig, TypeormConfig } from '../common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { LinksModule } from './links/links.module';
import { AppController } from './app.controller';
import { LinksService } from './links/links.service';
import { Link } from './links/entities/link.entity';
import { History } from './links/entities/history.entity';

@Module({
  imports: [
    ConfigModule.forRoot(EnvConfig),
    TypeOrmModule.forRootAsync(TypeormConfig),
    TypeOrmModule.forFeature([Link, History]),
    UsersModule,
    LinksModule,
  ],
  controllers: [AppController],
  providers: [LinksService],
})
export class AppModule {}
