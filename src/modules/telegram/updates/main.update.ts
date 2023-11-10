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
        from: { id: telegramId, username, language_code: languageCode },
      },
    } = ctx;

    const user = await this.usersService.getByTelegramId(telegramId);

    if (!user) {
      await this.usersService.insert({
        telegramId,
        username,
        languageCode,
      });

      ctx.reply(
        'Добро пожаловать! Мы работаем в тестовом режиме. Отправь мне ссылку, которую нужно сократить',
      );

      return;
    }

    if (user.isBlocked) {
      return;
    }

    await next();
  }
}
