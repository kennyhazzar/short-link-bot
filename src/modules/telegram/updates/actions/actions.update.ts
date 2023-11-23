import { Action, Update } from 'nestjs-telegraf';
import { MediaGroup } from 'telegraf/typings/telegram-types';
import { Update as TelegrafUpdate } from 'telegraf/typings/core/types/typegram';
import { ConfigService } from '@nestjs/config';
import { LinksService } from '@resource/links/links.service';
import { UsersService } from '@resource/users/users.service';
import {
  MainUpdateContext,
  CommonConfigs,
  languageInlineKeyboard,
  getTextByLanguageCode,
  getLanguageByCode,
  getLinkInformationText,
  showLinkInfoInlineKeyboard,
} from '@core/index';
import { Logger } from '@nestjs/common';

@Update()
export class ActionsUpdate {
  private readonly logger = new Logger(ActionsUpdate.name);

  constructor(
    private readonly linksService: LinksService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Action(/subscribe_+/)
  async setSubscribe(ctx: MainUpdateContext) {
    const { callback_query: callbackQuery } =
      ctx.update as TelegrafUpdate.CallbackQueryUpdate;
    const languageCode = ctx.state.user.languageCode;

    const [, alias] = (callbackQuery as any).data.split('_');
    try {
      let link = await this.linksService.getByAliasAndTelegramId(
        alias,
        ctx.chat.id,
      );

      if (link) {
        const { appUrl } = this.configService.get<CommonConfigs>('common');

        link = await this.linksService.updateLinkByAlias(alias, {
          isSubscribe: !link.isSubscribe,
        });

        const caption = getLinkInformationText(languageCode, link, appUrl);

        try {
          await ctx.editMessageText(caption, {
            reply_markup: {
              inline_keyboard: showLinkInfoInlineKeyboard(languageCode, link),
            },
            disable_web_page_preview: true,
            parse_mode: 'Markdown',
          });
        } catch (error) {
          ctx.answerCbQuery(
            getTextByLanguageCode(
              languageCode,
              'subscribe_already_action_error',
            ),
            {
              show_alert: true,
            },
          );
        }
      } else {
        await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
        await ctx.answerCbQuery(
          getTextByLanguageCode(
            languageCode,
            'stats_error_link_does_not_found',
          ),
          {
            show_alert: true,
          },
        );
      }
    } catch (error) {
      this.logger.error(error);
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
      await ctx.answerCbQuery(
        getTextByLanguageCode(languageCode, 'subscribe_internal_error'),
        {
          show_alert: true,
        },
      );
    }
  }

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
          {
            disable_web_page_preview: true,
          },
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
