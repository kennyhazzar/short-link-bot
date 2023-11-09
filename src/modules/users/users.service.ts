import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InsertUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async insertUser(user: InsertUserDto): Promise<void> {
    await this.userRepository.insert(user);
  }

  public async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  public async updateUserById(id: string, payload: User): Promise<void> {
    await this.userRepository.save({ id, ...payload });
  }
}
