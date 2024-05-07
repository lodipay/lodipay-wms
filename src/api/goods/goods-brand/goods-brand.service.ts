import { FilterDto } from '@/common/dto/filter.dto';
import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { GoodsBrand } from '../../../database/entities/goods-brand.entity';
import { CreateGoodsBrandDto } from './dto/create-goods-brand.dto';
import { UpdateGoodsBrandDto } from './dto/update-goods-brand.dto';
@Injectable()
export class GoodsBrandService {
    constructor(
        @InjectRepository(GoodsBrand)
        private readonly goodsBrandRepository: EntityRepository<GoodsBrand>,
        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create(createGoodsBrandDto: CreateGoodsBrandDto) {
        const entity = new GoodsBrand();
        this.em.assign(entity, createGoodsBrandDto);
        await this.em.persistAndFlush(entity);

        return entity;
    }
    search(filterDto: FilterDto) {
        return this.filterService.search<GoodsBrand>(GoodsBrand, filterDto);
    }

    findOne(id: number) {
        return this.goodsBrandRepository.findOne({ id });
    }

    async update(id: number, updateGoodsBrandDto: UpdateGoodsBrandDto) {
        const entity = await this.findOne(id);
        this.em.assign(entity, updateGoodsBrandDto, { mergeObjects: true });
        await this.em.persistAndFlush(entity);

        return entity;
    }
}
