import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafConfigs } from '../common';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}
  @Get()
  @Redirect()
  async redirectToMain() {
    const { url } = this.configService.get<TelegrafConfigs>('tg');

    return { url };
  }

  @Get(':alias')
  @Redirect()
  async redirect(@Param('alias') alias: string) {
    return { url: `links/${alias}` };
  }
}
