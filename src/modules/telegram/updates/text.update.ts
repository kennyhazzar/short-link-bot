import { On, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import {
  generateId,
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
    const url = getValidUrlByTelegramUserMessage(
      ctx.message as Message.TextMessage,
    );

    if (url) {
      const alias = generateId();
      this.linksService.createLink({ url, alias }, ctx.chat.id);
      const { appUrl } = this.configService.get<CommonConfigs>('common');
      const shortLink = `${appUrl}/${alias}`;

      this.linkQueue.add('send_alias_link', {
        shortLink,
        originalLink: url,
        telegramId: ctx.chat.id,
      });
    } else {
      ctx.reply(
        `Твоя ссылка невалидна. Проверь свою ссылку, и попробуй еще раз`,
      );
    }
  }
}
