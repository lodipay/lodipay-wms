import { FilterDto } from '@/common/dto/filter.dto';
import { FilterService } from '@/common/module/filter/filter.service';
import { GoodsColor } from '@/database/entities/goods-color.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateGoodsColorDto } from './dto/create-goods-color.dto';
import { UpdateGoodsColorDto } from './dto/update-goods-color.dto';
@Injectable()
export class GoodsColorService {
    constructor(
        @InjectRepository(GoodsColor)
        private readonly goodsBrandRepository: EntityRepository<GoodsColor>,
        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create(createGoodsColorDto: CreateGoodsColorDto) {
        const entity = new GoodsColor();
        this.em.assign(entity, createGoodsColorDto);
        await this.em.persistAndFlush(entity);

        return entity;
    }
    search(filterDto: FilterDto) {
        return this.filterService.search<GoodsColor>(GoodsColor, filterDto);
    }

    findOne(id: number) {
        return this.goodsBrandRepository.findOne({ id });
    }

    async update(id: number, updateGoodsColorDto: UpdateGoodsColorDto) {
        const entity = await this.findOne(id);
        this.em.assign(entity, updateGoodsColorDto, { mergeObjects: true });
        await this.em.persistAndFlush(entity);

        return entity;
    }
}
