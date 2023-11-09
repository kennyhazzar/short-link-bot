import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { CommonConfigs } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { port } = app.get(ConfigService).get<CommonConfigs>('common');

  await app.listen(port, async () =>
    console.log(`app was running on ${await app.getUrl()}`),
  );
}
bootstrap();
