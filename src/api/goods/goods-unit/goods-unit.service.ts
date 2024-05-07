import { FilterDto } from '@/common/dto/filter.dto';
import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { GoodsUnit } from '../../../database/entities/goods-unit.entity';
import { CreateGoodsUnitDto } from './dto/create-goods-unit.dto';
import { UpdateGoodsUnitDto } from './dto/update-goods-unit.dto';
@Injectable()
export class GoodsUnitService {
    constructor(
        @InjectRepository(GoodsUnit)
        private readonly goodsBrandRepository: EntityRepository<GoodsUnit>,
        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create(createGoodsUnitDto: CreateGoodsUnitDto) {
        const entity = new GoodsUnit();
        this.em.assign(entity, createGoodsUnitDto);
        await this.em.persistAndFlush(entity);

        return entity;
    }
    search(filterDto: FilterDto) {
        return this.filterService.search<GoodsUnit>(GoodsUnit, filterDto);
    }

    findOne(id: number) {
        return this.goodsBrandRepository.findOne({ id });
    }

    async update(id: number, updateGoodsUnitDto: UpdateGoodsUnitDto) {
        const entity = await this.findOne(id);
        this.em.assign(entity, updateGoodsUnitDto, { mergeObjects: true });
        await this.em.persistAndFlush(entity);

        return entity;
    }
}
