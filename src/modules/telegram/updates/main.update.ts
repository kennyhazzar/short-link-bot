import { Update, Use } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { UsersService } from '../../users/users.service';
import { getTextByLanguageCode } from '../../../common/utils';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ConfigService } from '@nestjs/config';
import { CommonConfigs } from '../../../common';

@Update()
export class MainUpdate {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Use()
  async checkUser(ctx: Context, next: () => Promise<void>) {
    const message = ctx.message as Message.TextMessage;
    const notFoundCommand = '/start not_found_';

    if (message.text.includes(notFoundCommand)) {
      const { appUrl } = this.configService.get<CommonConfigs>('common');

      ctx.reply(
        getTextByLanguageCode(ctx.from.language_code, 'link_not_found', {
          link: `${appUrl}/${message.text.split(notFoundCommand)[1]}`,
        }),
        {
          parse_mode: 'Markdown',
        },
      );

      return;
    }

    const user = await this.usersService.getByTelegramId(ctx.chat.id);

    if (!user) {
      await this.usersService.insert({
        telegramId: ctx.chat.id,
        username: ctx.from.username,
        languageCode: ctx.from.language_code,
      });

      ctx.reply(getTextByLanguageCode(ctx.from.language_code, 'start'));

      return;
    }

    if (user.isBlocked) {
      return;
    }

    next();
  }
}
