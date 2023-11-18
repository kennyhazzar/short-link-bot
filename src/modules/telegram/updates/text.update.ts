import { On, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import {
  generateId,
  getTextByLanguageCode,
  getValidUrlByMessageForSubscribeCommand,
  getValidUrlByTelegramUserMessage,
} from '../../../common/utils';
import { LinksService } from '../../links/links.service';
import { ConfigService } from '@nestjs/config';
import {
  CommonConfigs,
  JobGetLinkPreview,
  JobSendAliasLink,
  Target,
} from '../../../common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Message } from 'telegraf/typings/core/types/typegram';

@Update()
export class TextUpdate {
  constructor(
    private readonly linksService: LinksService,
    private configService: ConfigService,
    @InjectQueue('link_queue') private linkQueue: Queue<JobSendAliasLink>,
    @InjectQueue('preview_queue')
    private previewQueue: Queue<JobGetLinkPreview>,
  ) {}

  @On('text')
  async validateUrl(ctx: Context) {
    const message = ctx.message as Message.TextMessage;
    const languageCode = ctx.from.language_code;

    if (
      message.text.includes('/start') &&
      message.entities.some(({ type }) => type === 'bot_command')
    ) {
      await this.startCommand(ctx);
      return;
    }

    if (
      message.text.includes('/sub') &&
      message.entities.some(({ type }) => type === 'bot_command')
    ) {
      await this.subscribeCommand(ctx);
      return;
    }

    const url = getValidUrlByTelegramUserMessage(message);

    if (url) {
      const { appUrl } = this.configService.get<CommonConfigs>('common');

      if (url.includes(appUrl)) {
        const [, alias] = url.replace(/\s/g, '').split(`${appUrl}/`);

        if (alias) {
          try {
            const link = await this.linksService.getByAliasAndTelegramId(
              alias,
              ctx.chat.id,
            );

            if (link) {
              const text = getTextByLanguageCode(languageCode, 'stats');

              ctx.reply(text + link.redirectsCount, {
                parse_mode: 'Markdown',
              });
            } else {
              ctx.reply(
                getTextByLanguageCode(
                  languageCode,
                  'stats_error_link_does_not_found',
                ),
              );
            }
          } catch (error) {}
        }
        return;
      }

      const alias = generateId();
      const shortLink = `${appUrl}/${alias}`;

      await this.linksService.createLink({ url, alias }, ctx.chat.id);

      Promise.allSettled([
        this.linkQueue.add('send_alias_link', {
          shortLink,
          originalLink: url,
          telegramId: ctx.chat.id,
          languageCode,
        }),
        this.previewQueue.add({
          url,
          alias,
          languageCode,
        }),
      ]);
    } else {
      ctx.reply(getTextByLanguageCode(languageCode, 'validation_error'));
    }
  }

  private async startCommand(ctx: Context) {
    ctx.reply(getTextByLanguageCode(ctx.from.language_code, 'start'));
  }

  private async subscribeCommand(ctx: Context) {
    const message = ctx.message as Message.TextMessage;
    const languageCode = ctx.from.language_code;

    if (message.text === '/sub') {
      await ctx.reply(getTextByLanguageCode(languageCode, 'sub_help'));

      return;
    }

    const url = getValidUrlByMessageForSubscribeCommand(message);

    if (url) {
      const { appUrl } = this.configService.get<CommonConfigs>('common');

      if (url.includes(appUrl)) {
        const splittedResult = url.split('/');
        const alias = splittedResult[splittedResult.length - 1];

        const link = await this.linksService.getByAliasAndTelegramId(
          alias,
          ctx.chat.id,
        );

        if (link) {
          const isSubscribe = !link.isSubscribe;
          const target: Target = isSubscribe
            ? 'subscribe_true'
            : 'subscribe_false';

          await this.linksService.updateLinkByAlias(alias, {
            isSubscribe,
          });

          await ctx.reply(
            getTextByLanguageCode(languageCode, target, {
              link: url,
            }),
            {
              parse_mode: 'Markdown',
            },
          );
        } else {
          await ctx.reply(
            getTextByLanguageCode(languageCode, 'link_not_found', {
              link: url,
            }),
            {
              parse_mode: 'Markdown',
            },
          );
        }
      } else {
        await ctx.reply(
          getTextByLanguageCode(languageCode, 'wrong_app_url_on_subscribe'),
        );
      }
    } else {
      await ctx.reply(getTextByLanguageCode(languageCode, 'validation_error'));
    }
  }
}
