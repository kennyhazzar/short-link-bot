import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { UpdateHistoryDto } from './dto/link.dto';
import { LinksService } from './links.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  IpwhoisConfigs,
  IpwhoisResponse,
  JobHistory,
  JobQRCode,
} from '../../common';
import { generateQR } from '../../common/utils';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Processor('link_queue')
export class LinkConsumer {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly linkService: LinksService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(LinkConsumer.name);

  @Process('history')
  async updateHistory(job: Job<JobHistory>) {
    const {
      data: {
        detectorResult: {
          result: {
            os: {
              family: osFamily,
              name: osName,
              platform: osPlatform,
              version: osVersion,
            },
          },
        },
        ip,
        link,
        userAgent,
      },
    } = job;

    const { url } = this.configService.get<IpwhoisConfigs>('ipwhois');

    const payload: UpdateHistoryDto = {
      ip,
      userAgent,
      osName,
      osPlatform,
      osVersion,
      osFamily,
    };

    if (!Object.keys(job.data.detectorResult.botResult).length) {
      try {
        const { data } = await axios.get<IpwhoisResponse>(`${url}/${ip}`);

        if (data.success) {
          const { city, type, country, longitude, latitude } = data;
          payload.city = city;
          payload.type = type;
          payload.country = country;
          payload.point = {
            type: 'Point',
            coordinates: [latitude, longitude],
          };
        }
      } catch (error: any) {
        console.log(error);
      }
    }
    await Promise.allSettled([
      this.linkService.updateHistoryByLinkId(link.id, payload),
      this.linkService.incrementRedirectCountByAliasId(job.data.link.alias),
    ]);
  }

  @Process('qr_generator')
  async processingQRCode(job: Job<JobQRCode>) {
    const { telegramId, url } = job.data;

    const source = await generateQR(job.data.url);

    this.bot.telegram.sendPhoto(
      telegramId,
      { source },
      {
        caption: {
          text: `\`${url}\``,
        },
        parse_mode: 'Markdown',
      },
    );
  }
}
