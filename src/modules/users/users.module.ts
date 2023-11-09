import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Link } from '../links/entities/link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Link])],
  providers: [UsersService],
})
export class UsersModule {}
