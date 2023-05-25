import { Collection, QueryOrder } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedDto } from '../../common/dto/paginated.dto';
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
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';

describe('WarehouseController', () => {
    let controller: WarehouseController;
    let warehouseService: WarehouseService;
    let warehouse: Warehouse;
    let inventory: Inventory;
    let inventory2: Inventory;
    let warehouseInventory1: WarehouseInventory;
    let warehouseInventory2: WarehouseInventory;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WarehouseController],
            providers: [
                WarehouseService,
                InventoryService,
                FilterService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig(Warehouse),
                getRepositoryMockConfig(WarehouseInventory),
                getRepositoryMockConfig(Inventory),
            ],
        }).compile();

        controller = module.get<WarehouseController>(WarehouseController);
        warehouseService = module.get<WarehouseService>(WarehouseService);

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

    it('should create a new warehouse', async () => {
        const data = {
            name: 'WH1',
            description: 'WH1 description',
            destinationId: 1,
        };
        jest.spyOn(warehouseService, 'create').mockImplementation(
            (dto: CreateWarehouseDto) => {
                const warehouse = new Warehouse(dto.name, dto.description);
                warehouse.id = 1;

                return Promise.resolve(warehouse);
            },
        );

        const result = await controller.create(data);
        expect(result).toBeInstanceOf(Warehouse);
        expect(result.id).toBe(1);
        expect(result.name).toBe(data.name);
        expect(result.description).toBe(data.description);
        expect(result.locations).toBeInstanceOf(Collection<Location>);
        expect(result.locations).toHaveLength(0);
    });

    it('should findAll warehouses', async () => {
        const result = [
            new Warehouse('WH1', 'WH1 description'),
            new Warehouse('WH2', 'WH2 description'),
        ];
        jest.spyOn(warehouseService, 'findAll').mockImplementation(() =>
            Promise.resolve(result),
        );
        expect(await controller.findAll()).toBe(result);
    });

    it('should findOne warehouse', async () => {
        const result = new Warehouse('WH1', 'WH1 description');
        jest.spyOn(warehouseService, 'findOne').mockImplementation(
            (id: number) => {
                result.id = id;
                return Promise.resolve(result);
            },
        );
    });

    it('should update warehouse', async () => {
        const result = new Warehouse('WH1-1', 'WH1 description');
        result.id = 1;

        jest.spyOn(warehouseService, 'update').mockImplementation(() => {
            return Promise.resolve(result);
        });
        expect(
            await controller.update(
                '1',
                new UpdateWarehouseDto({
                    name: 'WH1-1',
                }),
            ),
        ).toBe(result);
    });

    it('should remove warehouse', async () => {
        const result = 'deleted';
        jest.spyOn(warehouseService, 'remove').mockImplementation(() => {
            return Promise.resolve(result);
        });
        expect(await controller.remove('1')).toBe(result);
    });

    it('should assign new warehouse inventory', async () => {
        jest.spyOn(warehouseService, 'assignInventory').mockImplementation(
            () => {
                warehouseInventory1.id = 1;
                warehouseInventory1.createdAt = new Date();
                return Promise.resolve(warehouseInventory1);
            },
        );

        const result = await controller.assignInventory('1', {
            inventoryId: inventory.id,
            quantity: warehouseInventory1.quantity,
        });

        expect(result).toBeInstanceOf(WarehouseInventory);
        expect(result).toStrictEqual(warehouseInventory1);
    });

    it('should get warehouse inventories list', async () => {
        const query = {
            page: 2,
            limit: 10,
            query: {
                filter: {
                    inventory: {
                        name: {
                            $ilike: '%inventory%',
                        },
                    },
                },
                order: {
                    id: QueryOrder.ASC,
                },
            },
            populate: ['inventory'],
        };

        const result = [warehouseInventory1, warehouseInventory2];

        const paginatedDto = new PaginatedDto();
        jest.spyOn(warehouseService, 'getInventories').mockImplementation(
            filterDto => {
                expect(filterDto).toStrictEqual(query);
                paginatedDto.result = result;
                paginatedDto.page = filterDto.page;
                paginatedDto.limit = filterDto.limit;
                paginatedDto.total = 100;
                paginatedDto.totalPage = 10;

                return Promise.resolve(paginatedDto);
            },
        );

        expect(await controller.getInventories(query)).toStrictEqual(
            paginatedDto,
        );
    });

    it('should edit warehouse inventory', async () => {
        const updateQuantity = 2000;
        jest.spyOn(warehouseService, 'updateInventory').mockImplementation(
            () => {
                warehouseInventory1.quantity = updateQuantity;
                return Promise.resolve(warehouseInventory1);
            },
        );

        expect(
            await warehouseService.updateInventory(warehouse.id, inventory.id, {
                quantity: updateQuantity,
            }),
        ).toEqual({
            ...warehouseInventory1,
            quantity: updateQuantity,
        });
    });

    it('should remove warehouse inventory', async () => {
        jest.spyOn(warehouseService, 'removeInventory').mockImplementation(
            () => {
                return Promise.resolve();
            },
        );

        expect(
            await controller.deleteInventory(
                `${warehouse.id}`,
                `${inventory.id}`,
            ),
        ).toBe(undefined);
    });
});
