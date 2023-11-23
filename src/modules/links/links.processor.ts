import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { UpdateHistoryDto } from './dto';
import { LinksService } from './links.service';
import { ConfigService } from '@nestjs/config';
import {
  CommonConfigs,
  DetectorResult,
  IpwhoisConfigs,
  IpwhoisResponse,
  JobHistory,
  JobSendAliasLink,
  detector,
  generateQR,
  getTextByLanguageCode,
} from '@core/index';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import isbot from 'isbot';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Processor('link_queue')
export class LinkConsumer {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly linkService: LinksService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
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
        const { data } = await firstValueFrom(
          this.httpService.get<IpwhoisResponse>(`${url}/${ip}`),
        );

        if (data.success) {
          const { city, type, country, longitude, latitude } = data;
          payload.city = city;
          payload.type = type;
          payload.country = country;
          payload.point = {
            type: 'Point',
            coordinates: [longitude, latitude],
          };

          if (link.isSubscribe) {
            const { appUrl } = this.configService.get<CommonConfigs>('common');

            const text = getTextByLanguageCode(
              job.data.link.creator.languageCode,
              'new_redirect',
              {
                city,
                country,
                ip,
                userAgent,
                link: `${appUrl}/${link.alias}`,
              },
            );

            await this.bot.telegram.sendMessage(link.creator.telegramId, text, {
              parse_mode: 'Markdown',
              disable_web_page_preview: true,
            });
          }
        }
      } catch (error: any) {
        this.logger.error('ipwhois error');
      }
      await Promise.allSettled([
        this.linkService.updateHistoryByLinkId(link.id, payload),
        this.linkService.incrementRedirectCountByAliasId(job.data.link.alias),
      ]);
    }
  }

  @Process('send_alias_link')
  async processingQRCode(job: Job<JobSendAliasLink>) {
    const startTime = new Date().getTime();

    const { telegramId, shortLink: url, originalLink, languageCode } = job.data;
    const text = getTextByLanguageCode(languageCode, 'short_link_result', {
      original: originalLink,
      short: url,
    });

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

    this.logger.warn(
      `worker send_alias_link (alias: ${job.data.originalLink}): ${
        new Date().getTime() - startTime
      } ms`,
    );
  }
}
