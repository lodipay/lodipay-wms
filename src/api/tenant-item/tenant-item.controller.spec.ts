import { QueryOrder } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { FilterService } from '../../common/module/filter/filter.service';
import { Inventory } from '../../database/entities/inventory.entity';
import { TenantItem } from '../../database/entities/tenant-item.entity';
import { Tenant } from '../../database/entities/tenant.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { InventoryService } from '../inventory/inventory.service';
import { TenantService } from '../tenant/tenant.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { CreateTenantItemDto } from './dto/create-tenant-item.dto';
import { TenantItemController } from './tenant-item.controller';
import { TenantItemService } from './tenant-item.service';

describe('TenantItemController', () => {
    let controller: TenantItemController;
    let tenantItemService: TenantItemService;
    const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TenantItemController],
            providers: [
                TenantService,
                FilterService,
                TenantService,
                InventoryService,
                TenantItemService,
                WarehouseService,
                getRepositoryMockConfig(TenantItem),
                getRepositoryMockConfig(Tenant),
                getRepositoryMockConfig(Inventory),
                getRepositoryMockConfig(Warehouse),
                getEntityManagerMockConfig(),
            ],
        }).compile();

        controller = module.get<TenantItemController>(TenantItemController);
        tenantItemService = module.get<TenantItemService>(TenantItemService);
    });

    it('create', async () => {
        const data = {
            description: 'E-commerce',
            tenantId: 1,
            inventoryId: 1,
            inventoryQuantity: 50,
            warehouseId: 1,
            quantity: 50,
        };
        const tenant = new Tenant();
        tenant.name = 'E-commerce';
        tenant.description = 'E-commerce description';

        const inventory = new Inventory();
        inventory.id = 1;
        inventory.sku = 'SKU';
        inventory.name = 'Inventory';
        inventory.quantity = 50;
        inventory.batchCode = 'BATCH_CODE';

        jest.spyOn(tenantItemService, 'create').mockImplementation(
            (dto: CreateTenantItemDto) => {
                const tenantItem = new TenantItem();
                tenantItem.description = dto.description;
                tenantItem.quantity = dto.quantity;
                tenantItem.tenant = tenant;
                tenantItem.id = 1;
                tenantItem.createdAt = new Date();

                return Promise.resolve(tenantItem);
            },
        );

        delete data.tenantId;
        const result = await controller.create(data);
        expect(result).toBeInstanceOf(TenantItem);

        delete data.inventoryId;
        delete data.inventoryQuantity;
        delete data.warehouseId;

        expect(result).toMatchObject({
            id: 1,
            ...data,
            createdAt: expect.any(Date),
            tenant: expect.any(Tenant),
        });
    });

    it('search', async () => {
        const query = {
            page: 2,
            limit: 10,
            query: {
                filter: {
                    name: {
                        $ilike: '%holder%',
                    },
                },
                order: {
                    id: QueryOrder.ASC,
                },
            },
        };

        const result = [
            plainToClass(Tenant, { id: 1, description: 'E-commerce 1' }),
            plainToClass(Tenant, { id: 2, description: 'E-commerce 2' }),
        ];

        jest.spyOn(tenantItemService, 'search').mockImplementation(
            filterDto => {
                expect(filterDto).toStrictEqual(query);
                const paginatedDto = new PaginatedDto();
                paginatedDto.result = result;
                paginatedDto.page = filterDto.page;
                paginatedDto.limit = filterDto.limit;
                paginatedDto.total = 100;
                paginatedDto.totalPage = 10;

                return Promise.resolve(paginatedDto);
            },
        );

        const paginatedDto = new PaginatedDto();
        paginatedDto.result = result;
        paginatedDto.page = query.page;
        paginatedDto.limit = query.limit;
        paginatedDto.total = 100;
        paginatedDto.totalPage = 10;

        expect(await controller.search(query)).toStrictEqual(paginatedDto);
    });

    it('findOne', async () => {
        const result = plainToClass(TenantItem, {
            description: 'E-commerce',
        });
        jest.spyOn(tenantItemService, 'findOne').mockImplementation(
            (id: number) => {
                result.id = id;
                return Promise.resolve(result);
            },
        );
        expect(await controller.findOne('1')).toBe(result);
    });

    it('update', async () => {
        const demoTenant = plainToClass(Tenant, {
            description: 'E-commerce',
            activeFrom: yesterday,
            activeTo: tomorrow,
        });
        const result = demoTenant;
        result.id = 1;

        jest.spyOn(tenantItemService, 'update').mockImplementation((): any => {
            return Promise.resolve(result);
        });
        expect(
            await controller.update(
                '1',
                plainToClass(TenantItem, {
                    description: 'E-commerce',
                }),
            ),
        ).toBe(result);
    });

    it('remove', async () => {
        const result = 'deleted';
        jest.spyOn(tenantItemService, 'remove').mockImplementation(() => {
            return Promise.resolve(result);
        });
        expect(await controller.remove('1')).toBe(result);
    });
});
