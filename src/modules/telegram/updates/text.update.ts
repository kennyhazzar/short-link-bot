import { On, Update } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Message } from 'telegraf/typings/core/types/typegram';
import {
  COMMANDS,
  CommonConfigs,
  JobGetLinkPreview,
  JobSendAliasLink,
  MainUpdateContext,
  Target,
  languageMenu,
  showMediaGroupMenu,
  generateId,
  getLanguageByCode,
  getTextByLanguageCode,
  getValidUrlByMessageForSubscribeCommand,
  getValidUrlByTelegramUserMessage,
} from '@core/index';
import { LinksService } from '@resource/links/links.service';

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
  async validateUrl(ctx: MainUpdateContext) {
    const message = ctx.message as Message.TextMessage;
    const languageCode = ctx.state.user.languageCode;

    if (
      message.text.includes(COMMANDS.start) &&
      message.entities.some(({ type }) => type === 'bot_command') &&
      message.entities.length === 1
    ) {
      await this.startCommand(ctx);
      return;
    }

    if (
      message.text.includes(COMMANDS.subscribe) &&
      message.entities.some(({ type }) => type === 'bot_command') &&
      message.entities.length <= 2
    ) {
      await this.subscribeCommand(ctx);
      return;
    }

    if (message.text.includes(COMMANDS.language)) {
      await this.languageCommand(ctx);

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
              const caption = getTextByLanguageCode(languageCode, 'link_info', {
                title: link.title || '`Отсутствует`',
                description: link.description || '`Отсутствует`',
                createdAt: link.createdAt.toISOString(),
                originalLink: link.url,
                shortLink: `${appUrl}/${link.alias}`,
                redirectCount: String(link.redirectsCount),
                isSubscribe: getTextByLanguageCode(
                  languageCode,
                  link.isSubscribe ? 'yes_particle' : 'no_particle',
                ),
              });

              ctx.reply(caption, showMediaGroupMenu(languageCode, link.alias));

              return;
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

  private async startCommand(ctx: MainUpdateContext) {
    ctx.reply(getTextByLanguageCode(ctx.state.user.languageCode, 'start'));
  }

  private async subscribeCommand(ctx: MainUpdateContext) {
    const message = ctx.message as Message.TextMessage;
    const languageCode = ctx.state.user.languageCode;

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

  private async languageCommand(ctx: MainUpdateContext) {
    const languageCode = ctx.state.user.languageCode;

    await ctx.reply(
      getTextByLanguageCode(languageCode, 'language', {
        code: getLanguageByCode(languageCode)[languageCode],
      }),
      languageMenu(languageCode),
    );
  }
}
