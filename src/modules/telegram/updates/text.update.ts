import { On, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import {
  generateId,
  getTextByLanguageCode,
  getValidUrlByTelegramUserMessage,
} from '../../../common/utils';
import { LinksService } from '../../links/links.service';
import { ConfigService } from '@nestjs/config';
import { CommonConfigs, JobSendAliasLink } from '../../../common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Message } from 'telegraf/typings/core/types/typegram';

@Update()
export class TextUpdate {
  constructor(
    private readonly linksService: LinksService,
    private configService: ConfigService,
    @InjectQueue('link_queue') private linkQueue: Queue<JobSendAliasLink>,
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
    const url = getValidUrlByTelegramUserMessage(message);

    if (url) {
      const { appUrl } = this.configService.get<CommonConfigs>('common');

      if (url.includes(appUrl)) {
        const [_, alias] = url.replace(/\s/g, '').split(`${appUrl}/`);

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
      this.linksService.createLink({ url, alias }, ctx.chat.id);
      const shortLink = `${appUrl}/${alias}`;

      this.linkQueue.add('send_alias_link', {
        shortLink,
        originalLink: url,
        telegramId: ctx.chat.id,
        languageCode,
      });
    } else {
      ctx.reply(getTextByLanguageCode(languageCode, 'validation_error'));
    }
  }

  private async startCommand(ctx: Context) {
    ctx.reply(getTextByLanguageCode(ctx.from.language_code, 'start'));
  }
}
