import { EntityManager, EntityRepository, QueryOrder } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { TestingModule } from '@nestjs/testing';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { getTestingModule } from '../../common/mock/testing.module.mock';
import { FilterService } from '../../common/module/filter/filter.service';
import { Destination } from '../../database/entities/destination.entity';
import { Inventory } from '../../database/entities/inventory.entity';
import { TenantItem } from '../../database/entities/tenant-item.entity';
import { Tenant } from '../../database/entities/tenant.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { InventoryService } from '../inventory/inventory.service';
import { TenantService } from '../tenant/tenant.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { TenantItemService } from './tenant-item.service';

describe('TenantService', () => {
    let service: TenantItemService;
    let em: EntityManager;
    let repository: EntityRepository<TenantItem>;
    let filterService: FilterService;
    let tenantService: TenantService;
    let tenant: Tenant;
    let tenantItem1: TenantItem;
    let tenantItem2: TenantItem;
    let inventory: Inventory;
    let warehouse: Warehouse;
    let destination: Destination;

    beforeEach(async () => {
        const module: TestingModule = await getTestingModule({
            providers: [
                TenantItemService,
                InventoryService,
                WarehouseService,
                TenantService,
                FilterService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig(Tenant),
                getRepositoryMockConfig(TenantItem),
                getRepositoryMockConfig(Inventory),
                getRepositoryMockConfig(Warehouse),
            ],
        });
        service = module.get<TenantItemService>(TenantItemService);
        tenantService = module.get<TenantService>(TenantService);
        em = module.get<EntityManager>(EntityManager);
        repository = module.get<EntityRepository<TenantItem>>(
            getRepositoryToken(TenantItem),
        );
        filterService = module.get<FilterService>(FilterService);

        inventory = new Inventory();
        inventory.id = 1;
        inventory.sku = 'SKU';
        inventory.name = 'Inventory';
        inventory.quantity = 50;
        inventory.batchCode = 'BATCH_CODE';

        tenant = new Tenant();
        tenant.name = 'Tenant';
        tenant.description = 'Tenant description';

        tenantItem1 = new TenantItem();
        tenantItem1.quantity = 100;
        tenantItem1.description = 'Tenant item 1 desc';

        tenantItem2 = new TenantItem();
        tenantItem2.quantity = 200;
        tenantItem2.description = 'Tenant item 2 desc';

        destination = new Destination();
        destination.name = 'Destination 1';
        destination.description = 'Destination 1 desc';

        warehouse = new Warehouse();
        warehouse.name = 'Warehouse 1';
        warehouse.description = 'Warehouse 1 desc';
        warehouse.destination = destination;
    });

    it('create', async () => {
        const dto = {
            description: 'E-commerce',
            tenantId: 1,
            inventoryId: 1,
            quantity: 50,
            warehouseId: 1,
        };

        jest.spyOn(tenantService, 'findOne').mockImplementation(() => {
            return Promise.resolve(tenant);
        });

        const result = new TenantItem();
        result.description = dto.description;
        result.warehouse = warehouse;
        result.tenant = tenant;
        result.inventory = inventory;
        result.quantity = 100;

        jest.spyOn(em, 'assign').mockImplementation(() => {
            return result;
        });

        jest.spyOn(em, 'persistAndFlush').mockImplementation((obj: Tenant) => {
            result.id = obj.id = 1;
            result.createdAt = obj.createdAt;
            return Promise.resolve();
        });

        expect(await service.create(dto)).toMatchObject(result);
    });

    it('search', async () => {
        const query = {
            page: 2,
            limit: 10,
            query: {
                filter: {
                    name: {
                        $ilike: '%tasty%',
                    },
                },
                order: {
                    name: QueryOrder.DESC,
                },
            },
        };

        const inventory = new Inventory();
        inventory.id = 1;
        inventory.sku = 'SKU';
        inventory.name = 'Inventory';
        inventory.quantity = 50;
        inventory.batchCode = 'BATCH_CODE';

        const tenant = new Tenant();
        tenant.name = 'Tenant name';
        tenant.description = 'Tenant description';

        const tenantItem1 = new TenantItem();
        tenantItem1.description = 'E-commerce';
        tenantItem1.inventory = inventory;
        tenantItem1.quantity = 100;
        tenantItem1.tenant = tenant;

        // tenantItem1.activeFrom = yesterday;
        // tenantItem1.activeTo = tomorrow;

        const tenantItem2 = new Tenant();
        tenantItem2.description = 'Deliver to warehouse 1';
        // tenantItem2.activeFrom = yesterday;
        // tenantItem2.activeTo = tomorrow;

        const result = [tenantItem1, tenantItem2];

        jest.spyOn(filterService, 'search').mockImplementation(
            (_, filterDto) => {
                expect(filterDto).toStrictEqual(query);
                const paginatedDto = new PaginatedDto();
                paginatedDto.data = result;
                paginatedDto.page = filterDto.page;
                paginatedDto.limit = filterDto.limit;
                paginatedDto.total = 100;
                paginatedDto.totalPage = 10;

                return Promise.resolve(paginatedDto);
            },
        );

        const paginatedDto = new PaginatedDto();
        paginatedDto.data = result;
        paginatedDto.page = query.page;
        paginatedDto.limit = query.limit;
        paginatedDto.total = 100;
        paginatedDto.totalPage = 10;

        expect(await service.search(query)).toStrictEqual(paginatedDto);
    });

    it('findOne', async () => {
        tenantItem1.id = 1;

        jest.spyOn(repository, 'findOne').mockImplementation(
            (options: any): any => {
                expect(options.id).toBe(tenantItem1.id);
                return Promise.resolve(tenantItem1);
            },
        );

        expect(await service.findOne(1)).toStrictEqual(tenantItem1);
    });

    it('update', async () => {
        tenantItem1.id = 1;

        jest.spyOn(service, 'findOne').mockImplementation(
            (options: any): any => {
                expect(options).toBe(tenantItem1.id);
                return Promise.resolve(tenantItem1);
            },
        );

        const updatedDto = {
            description: 'Delivery to warehouse 1',
            quantity: 10,
        };

        jest.spyOn(em, 'assign').mockImplementation(
            (obj1: TenantItem, obj2: TenantItem) => {
                const mergedObj = Object.assign({}, obj1, obj2);
                obj1.description = obj2.description;
                obj1.quantity = obj2.quantity;
                obj1.createdAt = new Date();
                obj1.updatedAt = new Date();
                return mergedObj;
            },
        );

        expect(
            await service.update(1, {
                description: updatedDto.description,
                quantity: updatedDto.quantity,
            }),
        ).toMatchObject({
            ...updatedDto,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });

    it('remove', async () => {
        const result = new Tenant();
        result.description = 'Delivery to warehouse 1';
        result.id = 1;

        jest.spyOn(repository, 'findOne').mockImplementation(
            (options: any): any => {
                expect(options.id).toBe(result.id);
                return Promise.resolve(result);
            },
        );

        expect(await service.remove(1)).toStrictEqual('success');
    });
});
