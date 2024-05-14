import { FilterDto } from '@/common/dto/filter.dto';
import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { StockList } from '../../database/entities/stock-list.entity';
import { CreateStocckListDto } from './dto/create-stock-list.dto';
import { UpdateStockListDto } from './dto/update-stock-list.dto';
import { CreateStockListHoldDto } from './dto/create-stock-list-hold.dto';
@Injectable()
export class StockListService {
    constructor(
        @InjectRepository(StockList)
        private readonly stockListRepository: EntityRepository<StockList>,
        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create(createStocckListDto: CreateStocckListDto) {
        const entity = new StockList();
        this.em.assign(entity, createStocckListDto);
        await this.em.persistAndFlush(entity);

        return entity;
    }
    search(filterDto: FilterDto) {
        return this.filterService.search<StockList>(StockList, filterDto);
    }

    findOne(id: number) {
        return this.stockListRepository.findOne({ id });
    }

    async update(id: number, updateStockListDto: UpdateStockListDto) {
        const entity = await this.findOne(id);
        this.em.assign(entity, updateStockListDto, { mergeObjects: true });
        await this.em.persistAndFlush(entity);

        return entity;
    }
    async createStockListHolding(createStocckListHoldDto: CreateStockListHoldDto) {
        const entity = new StockList();
        this.em.assign(entity, createStocckListHoldDto);
        await this.em.persistAndFlush(entity);
    }
}
