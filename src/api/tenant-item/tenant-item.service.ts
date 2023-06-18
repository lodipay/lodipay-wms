import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { FilterService } from '../../common/module/filter/filter.service';
import { TenantItem } from '../../database/entities/tenant-item.entity';
import { InventoryService } from '../inventory/inventory.service';
import { TenantService } from '../tenant/tenant.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { CreateTenantItemDto } from './dto/create-tenant-item.dto';
import { UpdateTenantItemDto } from './dto/update-tenant-item.dto';

@Injectable()
export class TenantItemService {
    constructor(
        @InjectRepository(TenantItem)
        private readonly tenantItemRepo: EntityRepository<TenantItem>,
        private readonly em: EntityManager,

        @Inject(TenantService)
        private readonly tenantService: TenantService,

        @Inject(InventoryService)
        private readonly inventoryService: InventoryService,

        @Inject(WarehouseService)
        private readonly warehouseService: WarehouseService,

        private readonly filterService: FilterService,
    ) {}

    async create(dto: CreateTenantItemDto): Promise<TenantItem> {
        let tenantItem = await this.tenantItemRepo.findOne({
            inventory: {
                id: dto.inventoryId,
            },
            tenant: {
                id: dto.tenantId,
            },
            warehouse: {
                id: dto.warehouseId,
            },
        });

        if (tenantItem) {
            throw new Error('Tenant item already exists');
        }

        const inventory = await this.inventoryService.findOne(dto.inventoryId);

        const tenant = await this.tenantService.findOne(dto.tenantId);

        const warehouse = await this.warehouseService.findOne(dto.warehouseId);

        tenantItem = new TenantItem();
        tenantItem.inventory = inventory;
        tenantItem.tenant = tenant;
        tenantItem.quantity = dto.quantity;
        tenantItem.warehouse = warehouse;

        delete dto.tenantId;
        delete dto.inventoryId;

        const newTenant = this.em.assign(tenantItem, dto);
        await this.em.persistAndFlush(newTenant);

        return newTenant;
    }

    search(filterDto: FilterDto) {
        return this.filterService.search<TenantItem>(TenantItem, filterDto);
    }

    findOne(id: number): Promise<TenantItem> {
        return this.tenantItemRepo.findOne({ id });
    }

    async update(
        id: number,
        updateTenantDto: UpdateTenantItemDto,
    ): Promise<TenantItem> {
        const tenantItem = await this.findOne(id);

        this.em.assign(tenantItem, updateTenantDto, { mergeObjects: true });

        await this.em.persistAndFlush(tenantItem);

        return tenantItem;
    }

    async remove(id: number) {
        const tenantItem = await this.findOne(id);

        if (tenantItem) {
            await this.em.removeAndFlush(tenantItem);
        }

        return 'success';
    }
}
