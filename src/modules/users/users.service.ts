import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InsertUserDto } from './dto/user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_USER_TTL } from '../../common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async insertUser(user: InsertUserDto): Promise<void> {
    const insertedUser = await this.userRepository.save(user);
    this.cacheManager.set(
      `user_${insertedUser.id}`,
      insertedUser,
      CACHE_USER_TTL,
    );
  }

  public async getUserById(id: string): Promise<User> {
    const cacheKey = `user_${id}`;

    let cacheUser = await this.cacheManager.get<User>(cacheKey);
    if (!cacheUser) {
      cacheUser = await this.userRepository.findOne({ where: { id } });
      this.cacheManager.set(cacheKey, cacheUser, CACHE_USER_TTL);
    }
    return cacheUser;
  }

  public async updateUserById(id: string, payload: User): Promise<void> {
    const updatedUser = await this.userRepository.save({ id, ...payload });
    this.cacheManager.set(
      `user_${updatedUser.id}`,
      updatedUser,
      CACHE_USER_TTL,
    );
  }
}
