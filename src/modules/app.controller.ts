import { Controller, Get, Param, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get(':alias')
  @Redirect()
  async redirect(@Param('alias') alias: string) {
    return { url: `links/${alias}` };
  }
}
