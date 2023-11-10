import { On, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { generateId, generateQR, isUrlValid } from '../../../common/utils';
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

      const shortLink = `${appUrl}/${alias}`;

      const qrCode = await generateQR(shortLink);

      ctx.replyWithPhoto(
        { source: qrCode },
        {
          caption: {
            text: `\`${shortLink}\``,
          },
          parse_mode: 'Markdown',
        },
      );
    } else {
      ctx.reply(
        `Твоя ссылка невалидна. Проверь свою ссылку, и попробуй еще раз`,
      );
    }
  }
}
