import { Update, Use } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { UsersService } from '../../users/users.service';

@Update()
export class MainUpdate {
  constructor(private readonly usersService: UsersService) {}

  @Use()
  async checkUser(ctx: Context, next: () => Promise<void>) {
    const user = await this.usersService.getByTelegramId(ctx.chat.id);

    if (!user) {
      await this.usersService.insert({
        telegramId: ctx.chat.id,
        username: ctx.from.username,
        languageCode: ctx.from.language_code,
      });

      ctx.reply(
        'Добро пожаловать! Мы работаем в тестовом режиме. Отправь мне ссылку, которую нужно сократить',
      );

      return;
    }

    if (user.isBlocked) {
      return;
    }

    next();
  }
}
