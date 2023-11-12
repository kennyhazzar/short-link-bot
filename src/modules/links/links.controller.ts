import { Controller, Get, Logger, Param, Redirect, Req } from '@nestjs/common';
import { LinksService } from './links.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Request } from 'express';
import { detector } from '../../common/utils';
import { DetectorResult, JobHistory, TelegrafConfigs } from '../../common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import isBot from 'isbot';

@Controller('links')
export class LinksController {
  private readonly logger = new Logger(LinksController.name);

  constructor(
    private readonly linksService: LinksService,
    private readonly configService: ConfigService,
    @InjectQueue('link_queue') private linkQueue: Queue<JobHistory>,
  ) {}

  @ApiExcludeEndpoint()
  @Get(':alias')
  @Redirect()
  async redirect(@Param('alias') alias: string, @Req() request: Request) {
    const link = await this.linksService.getById(alias);
    const userAgent = request.headers['user-agent'];
    const ip =
      (request.headers['x-real-ip'] as string) ||
      (request.headers['x-forwarded-for'] as string) ||
      '';

    if (!link) {
      const { url } = this.configService.get<TelegrafConfigs>('tg');

      return {
        url,
      };
    } else {
      const detectorResult: DetectorResult = {
        result: detector.detect(request.headers['user-agent']),
        isBot: isBot(userAgent),
      };

      this.logger.log(
        `
        redirecting: ${alias}
        isBot: ${detectorResult.isBot}
        userAgent: ${userAgent}
        `,
      );

      this.linkQueue.add('history', {
        detectorResult,
        ip: ip.replace('::ffff:', ''),
        link,
        userAgent,
      });
    }

    return {
      url: link.url,
    };
  }
}
