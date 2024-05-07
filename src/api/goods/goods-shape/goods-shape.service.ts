import { FilterDto } from '@/common/dto/filter.dto';
import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { GoodsShape } from '../../../database/entities/goods-shape.entity';
import { CreateGoodsShapeDto } from './dto/create-goods-shape.dto';
import { UpdateGoodsShapeDto } from './dto/update-goods-shape.dto';
@Injectable()
export class GoodsShapeService {
    constructor(
        @InjectRepository(GoodsShape)
        private readonly goodsBrandRepository: EntityRepository<GoodsShape>,
        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create(createGoodsShapeDto: CreateGoodsShapeDto) {
        const entity = new GoodsShape();
        this.em.assign(entity, createGoodsShapeDto);
        await this.em.persistAndFlush(entity);

        return entity;
    }
    search(filterDto: FilterDto) {
        return this.filterService.search<GoodsShape>(GoodsShape, filterDto);
    }

    findOne(id: number) {
        return this.goodsBrandRepository.findOne({ id });
    }

    async update(id: number, updateGoodsShapeDto: UpdateGoodsShapeDto) {
        const entity = await this.findOne(id);
        this.em.assign(entity, updateGoodsShapeDto, { mergeObjects: true });
        await this.em.persistAndFlush(entity);

        return entity;
    }
}
