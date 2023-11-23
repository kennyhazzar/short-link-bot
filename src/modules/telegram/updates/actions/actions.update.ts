import { Action, Update } from 'nestjs-telegraf';
import { MediaGroup } from 'telegraf/typings/telegram-types';
import { Update as TelegrafUpdate } from 'telegraf/typings/core/types/typegram';
import { ConfigService } from '@nestjs/config';
import { LinksService } from '../../../links/links.service';
import { UsersService } from '../../../users/users.service';
import {
  MainUpdateContext,
  CommonConfigs,
  languageInlineKeyboard,
  getTextByLanguageCode,
  getLanguageByCode,
} from '../../../../common';

@Update()
export class ActionsUpdate {
  constructor(
    private readonly linksService: LinksService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Action(/media_+/)
  async showLinkMedia(ctx: MainUpdateContext) {
    const { callback_query: callbackQuery } =
      ctx.update as TelegrafUpdate.CallbackQueryUpdate;
    const languageCode = ctx.state.user.languageCode;

    const [, alias] = (callbackQuery as any).data.split('_');

    const link = await this.linksService.getByAliasAndTelegramId(
      alias,
      ctx.state.user.telegramId,
    );

    if (
      link.images !== undefined &&
      link.favicons !== undefined &&
      link.images?.length &&
      link.favicons?.length
    ) {
      const images = [...link.images, ...link.favicons];

      if (images.length > 10) {
        images.length = 10;
      }

      const media: MediaGroup = images
        .filter((url) => !url.endsWith('svg') || !url.includes('.svg'))
        .map((url) => ({
          type: 'photo',
          media: { url },
          caption: `original: ${url}`,
        }));

      try {
        await ctx.replyWithMediaGroup(media);
        await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
        ctx.answerCbQuery(
          getTextByLanguageCode(languageCode, 'show_link_media_success'),
        );
      } catch (error) {
        console.log(error);
        await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
        const imageLink = await this.linksService.createImageLink(
          ctx.state.user.telegramId,
          alias,
        );
        const { appUrl } = this.configService.get<CommonConfigs>('common');
        ctx.reply(
          getTextByLanguageCode(languageCode, 'show_link_media_error', {
            link: `${appUrl}/links/images?id=${imageLink}`,
          }),
        );
      }

      return;
    } else {
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
      ctx.answerCbQuery(
        getTextByLanguageCode(languageCode, 'show_link_media_not_found'),
        {
          show_alert: true,
        },
      );
    }
  }

  @Action(/language_+/)
  async setLanguage(ctx: MainUpdateContext) {
    const { callback_query: callbackQuery } =
      ctx.update as TelegrafUpdate.CallbackQueryUpdate;

    const [, languageCode] = (callbackQuery as any).data.split('_');

    if (languageCode && languageCode === ctx.state.user.languageCode) {
      ctx.answerCbQuery(
        getTextByLanguageCode(
          ctx.state.user.languageCode,
          'language_error_current_choice',
        ),
      );

      return;
    }

    await this.usersService.updateById(ctx.chat.id, {
      languageCode,
    });

    await ctx.editMessageText(
      getTextByLanguageCode(languageCode, 'language', {
        code: getLanguageByCode(languageCode)[languageCode],
      }),
      {
        reply_markup: {
          inline_keyboard: languageInlineKeyboard(languageCode),
        },
      },
    );
  }
}
