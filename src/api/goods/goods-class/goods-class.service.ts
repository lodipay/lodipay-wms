import { FilterDto } from '@/common/dto/filter.dto';
import { FilterService } from '@/common/module/filter/filter.service';
import { GoodsClass } from '@/database/entities/goods-class.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateGoodsClassDto } from './dto/create-goods-class.dto';
import { UpdateGoodsClassDto } from './dto/update-goods-class.dto';
@Injectable()
export class GoodsClassService {
    constructor(
        @InjectRepository(GoodsClass)
        private readonly goodsBrandRepository: EntityRepository<GoodsClass>,
        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create(createGoodsClassDto: CreateGoodsClassDto) {
        const entity = new GoodsClass();
        this.em.assign(entity, createGoodsClassDto);
        await this.em.persistAndFlush(entity);

        return entity;
    }
    search(filterDto: FilterDto) {
        return this.filterService.search<GoodsClass>(GoodsClass, filterDto);
    }

    findOne(id: number) {
        return this.goodsBrandRepository.findOne({ id });
    }

    async update(id: number, updateGoodsClassDto: UpdateGoodsClassDto) {
        const entity = await this.findOne(id);
        this.em.assign(entity, updateGoodsClassDto, { mergeObjects: true });
        await this.em.persistAndFlush(entity);

        return entity;
    }
}
