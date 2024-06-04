import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import {
  FindOptionsOrderValue,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Link } from './entities/link.entity';
import {
  CacheMediaFiles,
  InsertLinkDto,
  MediaFiles,
  UpdateHistoryDto,
  UpdateLinkDto,
} from './dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_LINK_TTL, IMAGE_LINK_TTL, generateId } from '@core/index';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link) private readonly linkRepository: Repository<Link>,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createLink(
    payload: InsertLinkDto,
    telegramId?: number,
  ): Promise<InsertLinkDto> {
    const options: InsertLinkDto & Pick<Link, 'creator'> = {
      ...payload,
    };

    if (telegramId) {
      const user = await this.userRepository.findOne({ where: { telegramId } });

      if (user) {
        options.creator = user;
      }
    }

    const insertedLink = await this.linkRepository.save(options);
    this.cacheManager.set(
      `link_${insertedLink.alias}`,
      insertedLink,
      CACHE_LINK_TTL,
    );
    return payload;
  }

  async incrementRedirectCountByAliasId(alias: string): Promise<void> {
    const cacheKey = `link_${alias}`;
    await this.linkRepository.increment({ alias }, 'redirectsCount', 1);
    const link = await this.cacheManager.get<Link>(cacheKey);
    if (link) {
      const redirectsCount = link.redirectsCount + 1;
      this.cacheManager.set(
        cacheKey,
        { ...link, redirectsCount },
        CACHE_LINK_TTL,
      );
    }
  }

  async getById(alias: string): Promise<Link> {
    const where: FindOptionsWhere<Link> = { alias, isDeleted: false };
    const cacheKey = `link_${alias}`;
    let link = await this.cacheManager.get<Link>(cacheKey);
    if (!link) {
      link = await this.linkRepository.findOne({
        where,
        relations: ['creator'],
      });
      if (link) {
        this.cacheManager.set(cacheKey, link, CACHE_LINK_TTL);
      }
    }
    return link;
  }

  async getByAliasAndTelegramId(
    alias: string,
    telegramId: number,
    select: FindOptionsSelect<Link> = {},
  ) {
    return await this.linkRepository.findOne({
      where: {
        alias,
        creator: {
          telegramId,
        },
      },
      select,
    });
  }

  async getLinksByUserId(
    id: string,
    orderType: FindOptionsOrderValue,
    skip: number,
    take: number,
  ): Promise<Link[]> {
    return await this.linkRepository.find({
      where: { creator: { id }, isDeleted: false },
      order: { createdAt: orderType },
      skip,
      take,
      relations: ['creator'],
    });
  }

  async updateLinkByAlias(
    alias: string,
    payload: UpdateLinkDto,
  ): Promise<Link> {
    const cacheKey = `link_${alias}`;

    let link = await this.linkRepository.findOne({
      where: { alias },
      relations: ['creator'],
    });

    if (link) {
      link = await this.linkRepository.save({ ...link, ...payload });
      await this.cacheManager.set(cacheKey, { ...link, ...payload });
    }

    return link;
  }

  async deleteLinkByAlias(alias: string): Promise<void> {
    await this.linkRepository.save({ alias, isDeleted: true });
    this.cacheManager.del(`link_${alias}`);
  }

  async updateHistoryByLinkId(
    id: string,
    payload: UpdateHistoryDto,
  ): Promise<void> {
    await this.historyRepository.insert({ link: { id }, ...payload });
  }

  async getHistoryByLinkId(
    id: string,
    orderType: FindOptionsOrderValue,
    skip: number,
    take: number,
  ): Promise<History[]> {
    return await this.historyRepository.find({
      where: { link: { id, isDeleted: false } },
      order: { createdAt: orderType },
      skip,
      take,
      relations: ['link'],
    });
  }

  async getLinkImages(telegramId: number, alias: string): Promise<MediaFiles> {
    const link = await this.getByAliasAndTelegramId(alias, telegramId, {
      id: true,
      favicons: true,
      images: true,
    });

    if (link) {
      return {
        favicons: link.favicons,
        images: link.images,
      };
    } else {
      return {
        favicons: [],
        images: [],
      };
    }
  }

  async createImageLink(telegramId: number, alias: string): Promise<string> {
    const imageId = generateId(10);

    await this.cacheManager.set(
      `images_${imageId}`,
      { telegramId, alias },
      IMAGE_LINK_TTL,
    );

    return imageId;
  }

  async getImagesByCache(
    cacheKey: string,
  ): Promise<CacheMediaFiles | undefined> {
    return this.cacheManager.get<CacheMediaFiles>(`images_${cacheKey}`);
  }
}
