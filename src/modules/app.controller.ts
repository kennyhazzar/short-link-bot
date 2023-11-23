import {
  Controller,
  Get,
  Logger,
  Param,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JobHistory, TelegrafConfigs } from '@core/index';
import { ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ThrottlerBehindProxyGuard } from './auth/guard';
import { LinksService } from './links/links.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@ApiExcludeController()
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly linksService: LinksService,
    @InjectQueue('link_queue') private linkQueue: Queue<JobHistory>,
  ) {}
  @Get()
  @Redirect()
  async redirectToMain() {
    const { url } = this.configService.get<TelegrafConfigs>('tg');

    return { url };
  }

  @ApiExcludeEndpoint()
  @Get(':alias')
  @Redirect()
  @UseGuards(ThrottlerBehindProxyGuard)
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
        url: `${url}?start=not_found_${alias}`,
      };
    } else {
      this.logger.log(
        `
        redirecting: ${alias}
        userAgent: ${userAgent}
        `,
      );

      this.linkQueue.add('history', {
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
