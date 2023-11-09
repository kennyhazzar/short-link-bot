import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { UsersService } from '../../modules/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { History } from './entities/history.entity';
import { Link } from './entities/link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Link, History])],
  controllers: [LinksController],
  providers: [LinksService, UsersService],
})
export class LinksModule {}
