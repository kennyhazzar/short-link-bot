import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InsertUserDto, UpdateUserDto } from './dto/user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_USER_TTL } from '@core/index';
import { Link } from '@resource/links/entities/link.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Link) private linkRepository: Repository<Link>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async insert(user: InsertUserDto): Promise<User> {
    const insertedUser = await this.userRepository.save(user);
    this.cacheManager.set(
      `user_${insertedUser.telegramId}`,
      insertedUser,
      CACHE_USER_TTL,
    );
    return insertedUser;
  }

  public async getByTelegramId(telegramId: number): Promise<User> {
    const cacheKey = `user_${telegramId}`;

    let user = await this.cacheManager.get<User>(cacheKey);
    if (!user) {
      user = await this.userRepository.findOne({
        where: { telegramId },
      });
      if (user) {
        this.cacheManager.set(cacheKey, user, CACHE_USER_TTL);
      }
    }
    return user;
  }

  public async updateById(
    telegramId: number,
    payload: UpdateUserDto,
  ): Promise<void> {
    const user = await this.getByTelegramId(telegramId);

    if (user) {
      const updatedUser = await this.userRepository.save({
        ...user,
        ...payload,
      });
      const links = await this.linkRepository.find({
        where: { creator: { id: user.id } },
        relations: ['creator'],
      });

      if (links.length) {
        for (const link of links) {
          this.cacheManager.del(`link_${link.alias}`);
        }
      }
      this.cacheManager.set(
        `user_${updatedUser.telegramId}`,
        updatedUser,
        CACHE_USER_TTL,
      );
    }
  }
}
