import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JobHistory } from '../../common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MediaFiles } from './dto';
import { ThrottlerBehindProxyGuard } from '../auth/guard';

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
  @UseGuards(ThrottlerBehindProxyGuard)
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
}
