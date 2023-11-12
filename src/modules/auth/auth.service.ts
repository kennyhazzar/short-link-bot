import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {}

  async validateKey(apiKey: string): Promise<boolean> {
    return this.authRepository.exist({
      where: {
        creator: {
          isBlocked: false,
        },
        isRevoke: false,
        id: apiKey,
      },
    });
  }
}
