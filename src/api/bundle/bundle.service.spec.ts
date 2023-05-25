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
import { BundleHolder } from '../../database/entities/bundle-holder.entity';
import { Bundle } from '../../database/entities/bundle.entity';
import { Inventory } from '../../database/entities/inventory.entity';
import { BundleHolderService } from '../bundle-holder/bundle-holder.service';
import { InventoryService } from '../inventory/inventory.service';
import { BundleService } from './bundle.service';

describe('BundleService', () => {
    let service: BundleService;
    let em: EntityManager;
    let repository: EntityRepository<Bundle>;
    const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
    let filterService: FilterService;
    let bundleHolderService: BundleHolderService;

    beforeEach(async () => {
        const module: TestingModule = await getTestingModule({
            providers: [
                BundleService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig(Bundle),
                getRepositoryMockConfig(BundleHolder),
                getRepositoryMockConfig(Inventory),
                FilterService,
                BundleHolderService,
                InventoryService,
            ],
        });
        service = module.get<BundleService>(BundleService);
        bundleHolderService =
            module.get<BundleHolderService>(BundleHolderService);
        em = module.get<EntityManager>(EntityManager);
        repository = module.get<EntityRepository<Bundle>>(
            getRepositoryToken(Bundle),
        );
        filterService = module.get<FilterService>(FilterService);
    });

    it('create', async () => {
        const dto = {
            description: 'E-commerce',
            activeFrom: yesterday,
            activeTo: tomorrow,
            bundleHolderId: 1,
            inventoryId: 1,
            inventoryQuantity: 50,
        };
        const bundleHolder = plainToClass(BundleHolder, {
            id: 1,
            name: 'E-commerce',
            description: 'E-commerce description',
        });

        jest.spyOn(bundleHolderService, 'findOne').mockImplementation(() => {
            return Promise.resolve(bundleHolder);
        });

        const inventory = new Inventory();
        inventory.id = 1;
        inventory.sku = 'SKU';
        inventory.name = 'Inventory';
        inventory.quantity = 50;
        inventory.batchCode = 'BATCH_CODE';

        const result = new Bundle();
        result.description = dto.description;
        result.activeFrom = dto.activeFrom;
        result.activeTo = dto.activeTo;
        result.bundleHolder = bundleHolder;
        result.inventories.add(inventory);

        jest.spyOn(em, 'assign').mockImplementation(() => {
            return result;
        });

        jest.spyOn(em, 'persistAndFlush').mockImplementation((obj: Bundle) => {
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

        const bundle1 = new Bundle();
        bundle1.description = 'E-commerce';
        bundle1.activeFrom = yesterday;
        bundle1.activeTo = tomorrow;

        const bundle2 = new Bundle();
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
        const result = new Bundle();
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
            const warehouse = new Bundle();
            warehouse.description = result.description;
            warehouse.activeFrom = result.activeFrom;
            warehouse.activeTo = result.activeTo;

            warehouse.id = result.id;

            return Promise.resolve(warehouse);
        });

        jest.spyOn(em, 'assign').mockImplementation(
            (obj1: Bundle, obj2: Bundle) => {
                const mergedObj = Object.assign({}, obj1, obj2);
                obj1.description = mergedObj.description;
                obj1.activeFrom = mergedObj.activeFrom;
                obj1.activeTo = mergedObj.activeTo;
                obj1.updatedAt = new Date();
                return obj1;
            },
        );

        const updatedResult = new Bundle();
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
        const result = new Bundle();
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
