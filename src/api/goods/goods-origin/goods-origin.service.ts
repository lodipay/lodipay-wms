import { FilterDto } from '@/common/dto/filter.dto';
import { FilterService } from '@/common/module/filter/filter.service';
import { GoodsOrigin } from '@/database/entities/goods-origin.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateGoodsOriginDto } from './dto/create-goods-origin.dto';
import { UpdateGoodsOriginDto } from './dto/update-goods-origin.dto';
@Injectable()
export class GoodsOriginService {
    constructor(
        @InjectRepository(GoodsOrigin)
        private readonly goodsBrandRepository: EntityRepository<GoodsOrigin>,
        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create(createGoodsOriginDto: CreateGoodsOriginDto) {
        const entity = new GoodsOrigin();
        this.em.assign(entity, createGoodsOriginDto);
        await this.em.persistAndFlush(entity);

        return entity;
    }
    search(filterDto: FilterDto) {
        return this.filterService.search<GoodsOrigin>(GoodsOrigin, filterDto);
    }

    findOne(id: number) {
        return this.goodsBrandRepository.findOne({ id });
    }

    async update(id: number, updateGoodsOriginDto: UpdateGoodsOriginDto) {
        const entity = await this.findOne(id);
        this.em.assign(entity, updateGoodsOriginDto, { mergeObjects: true });
        await this.em.persistAndFlush(entity);

        return entity;
    }
}
