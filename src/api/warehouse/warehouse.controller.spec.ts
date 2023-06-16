import { Collection } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { FilterService } from '../../common/module/filter/filter.service';
import { Inventory } from '../../database/entities/inventory.entity';
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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WarehouseController],
            providers: [
                WarehouseService,
                InventoryService,
                FilterService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig(Warehouse),
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

        expect(await controller.findOne('1')).toEqual(result);
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
});
