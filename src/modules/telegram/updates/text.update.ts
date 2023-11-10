import { On, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { generateId, isUrlValid } from '../../../common/utils';
import { LinksService } from '../../links/links.service';
import { ConfigService } from '@nestjs/config';
import { CommonConfigs } from '../../../common';

@Update()
export class TextUpdate {
  constructor(
    private readonly linksService: LinksService,
    private configService: ConfigService,
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

      ctx.reply(`Твоя ссылка ${appUrl}/${alias}`);
    } else {
      ctx.reply(
        `Твоя ссылка невалидна. Проверь свою ссылку, и попробуй еще раз`,
      );
    }
  }
}
