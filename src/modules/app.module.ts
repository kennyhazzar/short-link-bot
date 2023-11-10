import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullConfig, EnvConfig, TypeormConfig } from '../common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { LinksModule } from './links/links.module';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(EnvConfig),
    TypeOrmModule.forRootAsync(TypeormConfig),
    BullModule.forRootAsync(BullConfig),
    UsersModule,
    LinksModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
