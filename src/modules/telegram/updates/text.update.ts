import { On, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { generateId, isUrlValid } from '../../../common/utils';
import { LinksService } from '../../links/links.service';
import { ConfigService } from '@nestjs/config';
import { CommonConfigs, JobQRCode } from '../../../common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Update()
export class TextUpdate {
  constructor(
    private readonly linksService: LinksService,
    private configService: ConfigService,
    @InjectQueue('link_queue') private linkQueue: Queue<JobQRCode>,
  ) {}

  @On('text')
  async validateUrl(ctx: Context) {
    const url = (ctx as any).message.text as string;
    if (isUrlValid(url)) {
      const alias = generateId();
      this.linksService.createLink({
        url,
        alias,
      });
      const { appUrl } = this.configService.get<CommonConfigs>('common');
      const shortLink = `${appUrl}/${alias}`;

      this.linkQueue.add('qr_generator', {
        url: shortLink,
        telegramId: ctx.chat.id,
      });
    } else {
      ctx.reply(
        `Твоя ссылка невалидна. Проверь свою ссылку, и попробуй еще раз`,
      );
    }
  }
}
