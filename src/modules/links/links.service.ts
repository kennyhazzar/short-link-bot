import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { FindOptionsOrderValue, Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { InsertLinkDto, UpdateHistoryDto } from './dto/link.dto';
import { generateId } from '../../common/utils';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link) private readonly linkRepository: Repository<Link>,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async createLink(
    payload: InsertLinkDto,
    userId?: string,
  ): Promise<InsertLinkDto> {
    if (!payload.alias) {
      payload.alias = generateId();
    }

    await this.linkRepository.insert({ ...payload, creator: { id: userId } });

    return payload;
  }

  async incrementRedirectCountById(id: string): Promise<void> {
    await this.linkRepository.increment({ id }, 'redirectsCount', 1);
  }

  async getLinkById(alias: string): Promise<Link> {
    return await this.linkRepository.findOne({
      where: { alias, isDeleted: false },
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
      relations: { creator: true },
    });
  }

  async deleteLinkById(id: string): Promise<void> {
    await this.linkRepository.save({ id, isDeleted: true });
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
