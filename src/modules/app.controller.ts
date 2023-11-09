import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { LinksService } from './links/links.service';

@Controller()
export class AppController {
  constructor(private linkServive: LinksService) {}

  @Get(':alias')
  @Redirect()
  async redirect(@Param('alias') alias: string) {
    const link = await this.linkServive.getLinkById(alias);

    if (!link) {
      return {
        url: '/',
      };
    }

    return { url: link.url };
  }
}
