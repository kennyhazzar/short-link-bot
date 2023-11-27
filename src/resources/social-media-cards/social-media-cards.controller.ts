import { Controller } from '@nestjs/common';
import { SocialMediaCardsService } from './social-media-cards.service';

@Controller('s')
export class SocialMediaCardsController {
  constructor(
    private readonly socialMediaCardsService: SocialMediaCardsService,
  ) {}
}
