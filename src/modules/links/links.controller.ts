import { Controller, Get, Param, Redirect, Req } from '@nestjs/common';
import { LinksService } from './links.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Request } from 'express';
import { detector } from '../../common/utils';
import { DetectorResult } from '../../common';
import { JobHistoryDto } from './dto/link.dto';
import { RealIP } from 'nestjs-real-ip';

@Controller()
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
    @InjectQueue('link_queue') private linkQueue: Queue<JobHistoryDto>,
  ) {}

  @Get(':alias')
  @Redirect()
  async redirect(
    @Param('alias') alias: string,
    @Req() request: Request,
    @RealIP() ip: string,
  ) {
    const link = await this.linksService.getLinkById(alias);
    const userAgent = request.headers['user-agent'];

    if (!link) {
      return {
        url: '/',
      };
    } else {
      const detectorResult: DetectorResult = {
        result: detector.detect(request.headers['user-agent']),
        botResult: detector.parseBot(request.headers['user-agent']),
      };

      this.linkQueue.add({
        detectorResult,
        ip,
        link,
        userAgent,
      });
    }

    return {
      url: link.url,
    };
  }
}
