import { Module } from '@nestjs/common';
import { SocialMediaCardsService } from './social-media-cards.service';
import { SocialMediaCardsController } from './social-media-cards.controller';

@Module({
  controllers: [SocialMediaCardsController],
  providers: [SocialMediaCardsService]
})
export class SocialMediaCardsModule {}
