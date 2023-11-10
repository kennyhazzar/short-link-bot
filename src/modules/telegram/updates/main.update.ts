import { Update, Use } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { UsersService } from '../../users/users.service';

@Update()
export class MainUpdate {
  constructor(private readonly usersService: UsersService) {}

  @Use()
  async checkUser(ctx: Context, next: () => Promise<void>) {
    const {
      message: {
        from: { id, username, language_code: languageCode },
      },
    } = ctx;

    
  }
}
