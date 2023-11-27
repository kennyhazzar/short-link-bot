import { Module } from '@nestjs/common';
import { SocialMediaCardsService } from './social-media-cards.service';
import { SocialMediaCardsController } from './social-media-cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialLinkHistory } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([SocialLinkHistory])],
  controllers: [SocialMediaCardsController],
  providers: [SocialMediaCardsService],
})
export class SocialMediaCardsModule {}
