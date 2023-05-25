import {
    Collection,
    EntityManager,
    EntityRepository,
    QueryOrder,
} from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { FilterService } from '../../common/module/filter/filter.service';
import { Inventory } from '../../database/entities/inventory.entity';
import { WarehouseInventory } from '../../database/entities/warehouse-inventory.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { InventoryService } from '../inventory/inventory.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { WarehouseService } from './warehouse.service';

describe('WarehouseService', () => {
    let service: WarehouseService;
    let em: EntityManager;
    let whRepository: EntityRepository<Warehouse>;
    let whInventoryRepository: EntityRepository<WarehouseInventory>;
    let warehouse: Warehouse;
    let inventory: Inventory;
    let inventory2: Inventory;
    let warehouseInventory1: WarehouseInventory;
    let warehouseInventory2: WarehouseInventory;
    let inventoryService: InventoryService;
    let filterService: FilterService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WarehouseService,
                InventoryService,
                FilterService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig<Inventory>(Inventory),
                getRepositoryMockConfig<Warehouse>(Warehouse),
                getRepositoryMockConfig<WarehouseInventory>(WarehouseInventory),
            ],
        }).compile();

        service = module.get<WarehouseService>(WarehouseService);
        inventoryService = module.get<InventoryService>(InventoryService);
        filterService = module.get<FilterService>(FilterService);
        em = module.get<EntityManager>(EntityManager);
        whRepository = module.get<EntityRepository<Warehouse>>(
            getRepositoryToken(Warehouse),
        );
        whInventoryRepository = module.get<
            EntityRepository<WarehouseInventory>
        >(getRepositoryToken(WarehouseInventory));

        warehouse = new Warehouse('zaisan', 'WH 1 description');
        warehouse.id = 1;

        inventory = new Inventory();
        inventory.id = 1;
        inventory.batchCode = 'BatchCode';
        inventory.name = 'Inventory 1';
        inventory.quantity = 1000;
        inventory.sku = 'SKU';

        inventory2 = new Inventory();
        inventory2.id = 1;
        inventory2.batchCode = 'BatchCode 2';
        inventory2.name = 'Inventory 2';
        inventory2.quantity = 1000;
        inventory2.sku = 'SKU 2';

        warehouseInventory1 = new WarehouseInventory();
        warehouseInventory1.inventory = inventory;
        warehouseInventory1.quantity = 200;
        warehouseInventory1.warehouse = warehouse;

        warehouseInventory2 = new WarehouseInventory();
        warehouseInventory2.inventory = inventory;
        warehouseInventory2.quantity = 300;
        warehouseInventory2.warehouse = warehouse;
    });

    it('create', async () => {
        const dto = new CreateWarehouseDto('WH1', 'WH1 description');

        const result = new Warehouse(dto.name, dto.description);

        jest.spyOn(em, 'persistAndFlush').mockImplementation(
            (obj: Warehouse) => {
                result.id = obj.id = 1;

                return Promise.resolve();
            },
        );

        expect(await service.create(dto)).toBeInstanceOf(Warehouse);
        expect(result.id).toBe(1);
        expect(result.name).toBe(dto.name);
        expect(result.description).toBe(dto.description);
        expect(result.locations).toBeInstanceOf(Collection);
        expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('findAll', async () => {
        const result = [
            new Warehouse('WH1', 'WH1 description'),
            new Warehouse('WH2', 'WH2 description'),
        ];

        jest.spyOn(whRepository, 'findAll').mockImplementation((): any => {
            return Promise.resolve(result);
        });

        expect(await service.findAll()).toStrictEqual(result);
    });

    it('findOne', async () => {
        const result = new Warehouse('WH1', 'WH1 description');
        result.id = 3;

        jest.spyOn(whRepository, 'findOne').mockImplementation(
            (options: any): any => {
                expect(options.id).toBe(result.id);
                return Promise.resolve(result);
            },
        );

        expect(await service.findOne(3)).toStrictEqual(result);
    });

    it('update', async () => {
        const result = {
            id: 3,
            name: 'WH1',
            description: 'WH1 description',
        };

        const warehouse = new Warehouse(result.name, result.description);
        warehouse.id = result.id;

        jest.spyOn(service, 'findOne').mockImplementation(() => {
            return Promise.resolve(warehouse);
        });

        jest.spyOn(em, 'assign').mockImplementation(
            (obj1: Warehouse, obj2: Warehouse) => {
                const mergedObj = Object.assign({}, obj1, obj2);
                obj1.id = mergedObj.id;
                obj1.name = mergedObj.name;
                obj1.description = mergedObj.description;

                return obj1;
            },
        );

        const updatedResult = new Warehouse('WH-updated', result.description);
        updatedResult.id = warehouse.id;
        updatedResult.createdAt = warehouse.createdAt;

        expect(
            await service.update(3, {
                name: updatedResult.name,
            }),
        ).toStrictEqual(updatedResult);
    });

    it('remove', async () => {
        const result = new Warehouse('WH1', 'WH1 description');
        result.id = 3;

        jest.spyOn(whRepository, 'findOne').mockImplementation(
            (options: any): any => {
                expect(options.id).toBe(result.id);
                return Promise.resolve(result);
            },
        );

        expect(await service.remove(3)).toStrictEqual('success');
    });

    describe('warehouse inventory', () => {
        describe('assign warehouse inventory', () => {
            it('should throw inventory assign error', async () => {
                jest.spyOn(inventoryService, 'findOne').mockImplementation(
                    () => {
                        return Promise.resolve(inventory);
                    },
                );

                jest.spyOn(whInventoryRepository, 'findOne').mockImplementation(
                    () => {
                        return Promise.resolve(warehouseInventory1);
                    },
                );

                const exception = expect(
                    service.assignInventory(3, {
                        inventoryId: 1,
                        quantity: 500,
                    }),
                ).rejects;
                exception.toThrow(InvalidArgumentException);
                exception.toThrowError(
                    'Same inventory already assigned in warehouse',
                );
            });

            it('should create new warehouse inventory assignment', async () => {
                jest.spyOn(inventoryService, 'findOne').mockImplementation(
                    () => {
                        return Promise.resolve(inventory);
                    },
                );

                jest.spyOn(whInventoryRepository, 'findOne').mockImplementation(
                    () => {
                        return Promise.resolve(undefined);
                    },
                );

                jest.spyOn(service, 'findOne').mockImplementation(() => {
                    return Promise.resolve(warehouse);
                });

                const result = new WarehouseInventory();
                jest.spyOn(em, 'persistAndFlush').mockImplementation(() => {
                    result.inventory = inventory;
                    result.warehouse = warehouse;
                    result.quantity = 500;
                    result.createdAt = new Date();
                    return Promise.resolve();
                });

                const response = await service.assignInventory(warehouse.id, {
                    inventoryId: inventory.id,
                    quantity: 500,
                });

                expect(response).toBeInstanceOf(WarehouseInventory);
                expect(response).toEqual(result);
            });
        });

        it('should update warehouse inventory assignment quantity', async () => {
            jest.spyOn(whInventoryRepository, 'findOne').mockImplementation(
                () => {
                    return Promise.resolve(warehouseInventory1);
                },
            );

            jest.spyOn(em, 'persistAndFlush').mockImplementation((obj: any) => {
                warehouseInventory1.quantity = obj.quantity;
                warehouseInventory1.updatedAt = new Date();
                return Promise.resolve();
            });

            const response = await service.updateInventory(
                warehouse.id,
                inventory.id,
                { quantity: 1000 },
            );

            expect(response).toBeInstanceOf(WarehouseInventory);
        });

        it('return warehouse inventories list', async () => {
            const query = {
                page: 2,
                limit: 10,
                query: {
                    filter: {
                        warehouse: {
                            name: {
                                $ilike: '%ware%',
                            },
                        },
                    },
                    order: {
                        id: QueryOrder.DESC,
                    },
                    populate: ['inventory'],
                },
            };

            const result = [inventory, inventory2];
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

            expect(await service.getInventories(query)).toStrictEqual(
                paginatedDto,
            );
        });

        describe('remove warehouse inventory', () => {
            it('Should throw an error', async () => {
                jest.spyOn(whInventoryRepository, 'findOne').mockImplementation(
                    () => {
                        return Promise.resolve(undefined);
                    },
                );

                const exception = expect(
                    service.removeInventory(3, inventory.id),
                ).rejects;
                exception.toThrow(InvalidArgumentException);
                exception.toThrowError('Warehouse inventory not found');
            });

            it('Should remove inventory', async () => {
                jest.spyOn(whInventoryRepository, 'findOne').mockImplementation(
                    () => {
                        return Promise.resolve(warehouseInventory1);
                    },
                );

                const response = await service.removeInventory(3, inventory.id);
                expect(response).toBe(undefined);
            });
        });
    });
});
