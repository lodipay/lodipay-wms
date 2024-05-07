import { FilterDto } from '@/common/dto/filter.dto';
import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Goods } from '../../../database/entities/goods.entity';
import { CreateGoodsDto } from './dto/create-goods.dto';
import { UpdateGoodsDto } from './dto/update-goods.dto';
@Injectable()
export class GoodsService {
    constructor(
        @InjectRepository(Goods)
        private readonly goodsRepository: EntityRepository<Goods>,
        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create(createGoodsMainDto: CreateGoodsDto) {
        const entity = new Goods();
        this.em.assign(entity, createGoodsMainDto);
        await this.em.persistAndFlush(entity);

        return entity;
    }
    search(filterDto: FilterDto) {
        return this.filterService.search<Goods>(Goods, filterDto);
    }

    findOne(id: number) {
        return this.goodsRepository.findOne({ id });
    }

    async update(id: number, updateGoodsDto: UpdateGoodsDto) {
        const entity = await this.findOne(id);
        this.em.assign(entity, updateGoodsDto, { mergeObjects: true });
        await this.em.persistAndFlush(entity);

        return entity;
    }
}
