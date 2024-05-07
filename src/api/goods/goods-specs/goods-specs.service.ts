import { FilterDto } from '@/common/dto/filter.dto';
import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { GoodsSpecs } from '../../../database/entities/goods-specs.entity';
import { CreateGoodsSpecsDto } from './dto/create-goods-specs.dto';
import { UpdateGoodsSpecsDto } from './dto/update-goods-specs.dto';
@Injectable()
export class GoodsSpecsService {
    constructor(
        @InjectRepository(GoodsSpecs)
        private readonly goodsBrandRepository: EntityRepository<GoodsSpecs>,
        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create(createGoodsSpecsDto: CreateGoodsSpecsDto) {
        const entity = new GoodsSpecs();
        this.em.assign(entity, createGoodsSpecsDto);
        await this.em.persistAndFlush(entity);

        return entity;
    }
    search(filterDto: FilterDto) {
        return this.filterService.search<GoodsSpecs>(GoodsSpecs, filterDto);
    }

    findOne(id: number) {
        return this.goodsBrandRepository.findOne({ id });
    }

    async update(id: number, updateGoodsSpecsDto: UpdateGoodsSpecsDto) {
        const entity = await this.findOne(id);
        this.em.assign(entity, updateGoodsSpecsDto, { mergeObjects: true });
        await this.em.persistAndFlush(entity);

        return entity;
    }
}
