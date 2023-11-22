import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Query,
  Redirect,
  Req,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Request } from 'express';
import { JobHistory, TelegrafConfigs } from '../../common';
import { ConfigService } from '@nestjs/config';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { MediaFiles } from './dto';

@Controller('links')
export class LinksController {
  private readonly logger = new Logger(LinksController.name);

  constructor(
    private readonly linksService: LinksService,
    private readonly configService: ConfigService,
    @InjectQueue('link_queue') private linkQueue: Queue<JobHistory>,
  ) {}

  @Get('images')
  @ApiOperation({
    summary: 'Метод для получения ссылок на медиа-файлы ссылки',
    description:
      'Ссылку можно получить только если медиа-файлы не удалось получить через Telegram. Доступ к медиа-файлам длится 20 минут',
  })
  @ApiResponse({
    description:
      'Объект с картинками. Данные медиа-файлы подгружаются при создании короткой ссылки',
    type: MediaFiles,
    status: HttpStatus.OK,
  })
  @ApiQuery({
    name: 'id',
    description: 'Идентификатор, полученный из чата с ботом',
  })
  @HttpCode(HttpStatus.OK)
  async getLinkImages(@Query('id') imageId: string): Promise<MediaFiles> {
    const imageCache = await this.linksService.getImagesByCache(imageId);

    if (imageCache) {
      const { telegramId, alias } = imageCache;

      return this.linksService.getLinkImages(telegramId, alias);
    } else {
      throw new NotFoundException();
    }
  }

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
