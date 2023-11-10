import {
  Controller,
  Get,
  Ip,
  Logger,
  Param,
  Redirect,
  Req,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Request } from 'express';
import { detector } from '../../common/utils';
import { DetectorResult, JobHistory, TelegrafConfigs } from '../../common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

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
  async redirect(
    @Param('alias') alias: string,
    @Req() request: Request,
    @Ip() ip: string,
  ) {
    this.logger.log(`redirecting: ${alias}`);

    const link = await this.linksService.getById(alias);
    const userAgent = request.headers['user-agent'];

    if (!link) {
      const { url } = this.configService.get<TelegrafConfigs>('tg');

      return {
        url,
      };
    } else {
      const detectorResult: DetectorResult = {
        result: detector.detect(request.headers['user-agent']),
        botResult: detector.parseBot(request.headers['user-agent']),
      };

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
