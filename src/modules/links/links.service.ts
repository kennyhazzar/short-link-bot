import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { FindOptionsOrderValue, Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { InsertLinkDto, UpdateHistoryDto } from './dto/link.dto';
import { generateId } from '../../common/utils';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_LINK_TTL } from '../../common';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link) private readonly linkRepository: Repository<Link>,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createLink(
    payload: InsertLinkDto,
    userId?: string,
  ): Promise<InsertLinkDto> {
    if (!payload.alias) {
      payload.alias = generateId();
    }
    const insertedLink = await this.linkRepository.save({
      ...payload,
      creator: { id: userId },
    });
    this.cacheManager.set(
      `link_${insertedLink.id}`,
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
    const cacheKey = `link_${alias}`;
    let link = await this.cacheManager.get<Link>(cacheKey);
    if (!link) {
      link = await this.linkRepository.findOne({
        where: { alias, isDeleted: false },
      });
      if (link) {
        this.cacheManager.set(cacheKey, link, CACHE_LINK_TTL);
      }
    }
    return link;
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
      relations: { creator: true },
    });
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
      relations: { link: true },
    });
  }
}
