import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { FilterDto } from '../dto/filter.dto';
import { PaginatedDto } from '../dto/paginated.dto';

@Injectable()
export class FilterService {
  constructor(private readonly em: EntityManager) {}

  async search<T>(entityClass: new () => T, filterDto: FilterDto) {
    let limit = filterDto.limit || 20;
    if (limit < 1) {
      limit = 1;
    }

    let page = filterDto.page || 1;
    if (page < 0) {
      page = 1;
    }

    const offset = limit * (page - 1);

    const [result, count] = await this.em.findAndCount(
      entityClass,
      {},
      {
        limit,
        offset,
        filters: { mainFilter: filterDto.query.filter || {} },
        orderBy: filterDto.query.order || {},
      },
    );

    const paginatedDto = new PaginatedDto();
    paginatedDto.limit = limit;
    paginatedDto.page = page;
    paginatedDto.total = count;
    paginatedDto.result = result;
    paginatedDto.totalPage = Math.ceil(count / limit);

    return paginatedDto;
  }
}
