import {
    Collection,
    EntityManager,
    EntityRepository,
    QueryOrder,
} from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { getTestingModule } from '../../common/mock/testing.module.mock';
import { FilterService } from '../../common/module/filter/filter.service';
import { Inventory } from '../../database/entities/inventory.entity';
import { Tenant } from '../../database/entities/tenant-item.entity';
import { InventoryService } from '../inventory/inventory.service';
import { TenantService } from '../tenant/tenant.service';

describe('TenantService', () => {
    let service: TenantService;
    let em: EntityManager;
    let repository: EntityRepository<Tenant>;
    const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
    let filterService: FilterService;
    let tenantService: TenantService;

    beforeEach(async () => {
        const module: TestingModule = await getTestingModule({
            providers: [
                TenantService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig(Tenant),
                getRepositoryMockConfig(Tenant),
                getRepositoryMockConfig(Inventory),
                FilterService,
                TenantService,
                InventoryService,
            ],
        });
        service = module.get<TenantService>(TenantService);
        tenantService = module.get<TenantService>(TenantService);
        em = module.get<EntityManager>(EntityManager);
        repository = module.get<EntityRepository<Tenant>>(
            getRepositoryToken(Tenant),
        );
        filterService = module.get<FilterService>(FilterService);
    });

    it('create', async () => {
        const dto = {
            description: 'E-commerce',
            activeFrom: yesterday,
            activeTo: tomorrow,
            tenantId: 1,
            inventoryId: 1,
            inventoryQuantity: 50,
        };
        const tenant = plainToClass(Tenant, {
            id: 1,
            name: 'E-commerce',
            description: 'E-commerce description',
        });

        jest.spyOn(tenantService, 'findOne').mockImplementation(() => {
            return Promise.resolve(tenant);
        });

        const inventory = new Inventory();
        inventory.id = 1;
        inventory.sku = 'SKU';
        inventory.name = 'Inventory';
        inventory.quantity = 50;
        inventory.batchCode = 'BATCH_CODE';

        const result = new Tenant();
        result.description = dto.description;
        result.activeFrom = dto.activeFrom;
        result.activeTo = dto.activeTo;
        result.tenant = tenant;
        result.inventories.add(inventory);

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

        const bundle1 = new Tenant();
        bundle1.description = 'E-commerce';
        bundle1.activeFrom = yesterday;
        bundle1.activeTo = tomorrow;

        const bundle2 = new Tenant();
        bundle2.description = 'Deliver to warehouse 1';
        bundle2.activeFrom = yesterday;
        bundle2.activeTo = tomorrow;

        const result = [bundle1, bundle2];

        jest.spyOn(filterService, 'search').mockImplementation(
            (_, filterDto) => {
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

        expect(await service.search(query)).toStrictEqual(paginatedDto);
    });

    it('findOne', async () => {
        const result = new Tenant();
        result.description = 'Deliver to warehouse 2';
        result.activeFrom = yesterday;
        result.activeTo = tomorrow;
        result.id = 1;

        jest.spyOn(repository, 'findOne').mockImplementation(
            (options: any): any => {
                expect(options.id).toBe(result.id);
                return Promise.resolve(result);
            },
        );

        expect(await service.findOne(1)).toStrictEqual(result);
    });

    it('update', async () => {
        const result = {
            id: 1,
            description: 'Delivery to warehouse 3',
            activeFrom: yesterday,
            activeTo: tomorrow,
        };

        jest.spyOn(service, 'findOne').mockImplementation(() => {
            const warehouse = new Tenant();
            warehouse.description = result.description;
            warehouse.activeFrom = result.activeFrom;
            warehouse.activeTo = result.activeTo;

            warehouse.id = result.id;

            return Promise.resolve(warehouse);
        });

        jest.spyOn(em, 'assign').mockImplementation(
            (obj1: Tenant, obj2: Tenant) => {
                const mergedObj = Object.assign({}, obj1, obj2);
                obj1.description = mergedObj.description;
                obj1.activeFrom = mergedObj.activeFrom;
                obj1.activeTo = mergedObj.activeTo;
                obj1.updatedAt = new Date();
                return obj1;
            },
        );

        const updatedResult = new Tenant();
        updatedResult.description = 'Delivery to warehouse 3';
        updatedResult.activeFrom = result.activeFrom;
        updatedResult.activeTo = result.activeTo;

        updatedResult.id = result.id;

        expect(
            await service.update(1, {
                description: updatedResult.description,
                activeFrom: updatedResult.activeFrom,
                activeTo: updatedResult.activeTo,
            }),
        ).toMatchObject({
            ...updatedResult,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            inventories: expect.any(Collection),
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
