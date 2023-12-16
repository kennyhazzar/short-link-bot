import { Update, Use } from 'nestjs-telegraf';
import { UsersService } from '@resource/users/users.service';
import {
  Message,
  Update as TelegrafUpdate,
} from 'telegraf/typings/core/types/typegram';
import { ConfigService } from '@nestjs/config';
import {
  CommonConfigs,
  MainUpdateContext,
  getTextByLanguageCode,
} from '@core/index';

@Update()
export class MainUpdate {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Use()
  async checkUser(ctx: MainUpdateContext, next: () => Promise<void>) {
    try {
      const message = ctx.message as Message.TextMessage;
      const notFoundCommand = '/start not_found_';

      if (
        (ctx.update as TelegrafUpdate.MessageUpdate)?.message &&
        message.text.includes(notFoundCommand)
      ) {
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

      ctx.state.user = user;
      const languageCode = ctx.from.language_code === 'en' ? 'en' : 'ru';

      if (!user) {
        await this.usersService.insert({
          telegramId: ctx.chat.id,
          username: ctx.from.username,
          languageCode,
        });

        ctx.reply(getTextByLanguageCode(languageCode, 'start'));

        return;
      }

      if (user.isBlocked) {
        return;
      }

      next();
    } catch (error) {
      console.log(error);
    }
  }
}
