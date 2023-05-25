import { InvalidArgumentException } from '@/common/exception/invalid.argument.exception';
import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { Inventory } from '../../database/entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepository: EntityRepository<Inventory>,
        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create(createInventoryDto: CreateInventoryDto) {
        const entity = new Inventory();
        this.em.assign(entity, createInventoryDto);
        await this.em.persistAndFlush(entity);

        return entity;
    }

    search(filterDto: FilterDto) {
        return this.filterService.search<Inventory>(Inventory, filterDto);
    }

    findOne(id: number) {
        return this.inventoryRepository.findOne({ id });
    }

    async update(id: number, updateInventoryDto: UpdateInventoryDto) {
        const entity = await this.findOne(id);
        this.em.assign(entity, updateInventoryDto, { mergeObjects: true });
        await this.em.persistAndFlush(entity);

        return entity;
    }

    async remove(id: number) {
        const entity = await this.findOne(id);
        if (entity) {
            await this.em.removeAndFlush(entity);
        }

        return 'deleted';
    }

    async setParent(id: number, parentId: number) {
        if (!id || id === parentId) {
            throw new InvalidArgumentException('invalid inventory id');
        }
        const entity = await this.findOne(id);
        if (!entity) {
            throw new InvalidArgumentException('invalid inventory id');
        }

        if (!parentId) {
            throw new InvalidArgumentException('invalid inventory id');
        }
        const parent = await this.findOne(parentId);

        if (!parent || parent.parent) {
            throw new InvalidArgumentException('invalid inventory id');
        }

        entity.parent = parent;
        await this.em.persistAndFlush(entity);

        return entity;
    }

    async unsetParent(id: number) {
        if (!id) {
            throw new InvalidArgumentException('invalid inventory id');
        }

        const entity = await this.findOne(id);
        if (!entity || !entity.parent) {
            throw new InvalidArgumentException('invalid inventory id');
        }

        entity.parent = null;
        await this.em.persistAndFlush(entity);
        return entity;
    }
}
