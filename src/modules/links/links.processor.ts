import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { UpdateHistoryDto } from './dto/link.dto';
import { LinksService } from './links.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  DetectorResult,
  IpwhoisConfigs,
  IpwhoisResponse,
  JobHistory,
  JobSendAliasLink,
} from '../../common';
import {
  detector,
  generateQR,
  getTextByLanguageCode,
} from '../../common/utils';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import isbot from 'isbot';

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
      data: { ip, link, userAgent },
    } = job;

    const { url } = this.configService.get<IpwhoisConfigs>('ipwhois');

    const {
      result: {
        os: {
          family: osFamily,
          name: osName,
          platform: osPlatform,
          version: osVersion,
        },
      },
      isBot,
    }: DetectorResult = {
      result: detector.detect(userAgent),
      isBot: isbot(userAgent),
    };

    const payload: UpdateHistoryDto = {
      ip,
      userAgent,
      osName,
      osPlatform,
      osVersion,
      osFamily,
    };

    if (!isBot) {
      try {
        const { data } = await axios.get<IpwhoisResponse>(`${url}/${ip}`);

        if (data.success) {
          const { city, type, country, longitude, latitude } = data;
          payload.city = city;
          payload.type = type;
          payload.country = country;
          payload.point = {
            type: 'Point',
            coordinates: [longitude, latitude],
          };
        }
      } catch (error: any) {
        console.log(error);
      }
      await Promise.allSettled([
        this.linkService.updateHistoryByLinkId(link.id, payload),
        this.linkService.incrementRedirectCountByAliasId(job.data.link.alias),
      ]);
    }
  }

  @Process('send_alias_link')
  async processingQRCode(job: Job<JobSendAliasLink>) {
    const { telegramId, shortLink: url, originalLink, languageCode } = job.data;
    const text = getTextByLanguageCode(languageCode, 'short_link_result')
      .replace('%original%', originalLink)
      .replace('%short%', url);

    try {
      const source = await generateQR(job.data.shortLink);
      this.bot.telegram.sendPhoto(
        telegramId,
        { source },
        {
          caption: {
            text,
          },
          parse_mode: 'Markdown',
        },
      );
    } catch (error) {}
  }
}
