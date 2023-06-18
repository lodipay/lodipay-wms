import { EntityManager, EntityRepository, FindOptions } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { FilterService } from '../../common/module/filter/filter.service';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { InventoryService } from '../inventory/inventory.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehouseService {
    constructor(
        @InjectRepository(Warehouse)
        private readonly warehouseRepository: EntityRepository<Warehouse>,

        private readonly em: EntityManager,

        @Inject(InventoryService)
        private readonly inventoryService: InventoryService,

        private readonly filterService: FilterService,
    ) {}

    async create(dto: CreateWarehouseDto): Promise<Warehouse> {
        const warehouse = new Warehouse(dto.name, dto.description);
        await this.em.persistAndFlush(warehouse);

        return warehouse;
    }

    findAll(): Promise<Warehouse[]> {
        return this.warehouseRepository.findAll();
    }

    findOne(id: number): Promise<Warehouse> {
        return this.warehouseRepository.findOne({ id });
    }

    async update(
        id: number,
        updateWarehouseDto: UpdateWarehouseDto,
    ): Promise<Warehouse> {
        const warehouse = await this.findOne(id);
        this.em.assign(warehouse, updateWarehouseDto, { mergeObjects: true });

        await this.em.persistAndFlush(warehouse);

        return warehouse;
    }

    async remove(id: number) {
        const warehouse = await this.findOne(id);

        if (warehouse) {
            await this.em.removeAndFlush(warehouse);
        }

        return 'success';
    }

    async getWarehouseWithOptions(
        id: number,
        options?: FindOptions<Warehouse, 'tenantItem'>,
    ) {
        const warehouse = await this.warehouseRepository.findOne(
            {
                id: id,
            },
            options,
        );

        return warehouse;
    }
}
