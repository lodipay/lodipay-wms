import { Collection, EntityManager, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
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
import { WarehouseService } from './warehouse.service';

describe('WarehouseService', () => {
    let service: WarehouseService;
    let inventoryService: InventoryService;
    let filterService: FilterService;
    let em: EntityManager;
    let whRepository: EntityRepository<Warehouse>;
    let warehouse: Warehouse;
    let inventory: Inventory;
    let inventory2: Inventory;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WarehouseService,
                InventoryService,
                FilterService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig<Inventory>(Inventory),
                getRepositoryMockConfig<Warehouse>(Warehouse),
            ],
        }).compile();

        service = module.get<WarehouseService>(WarehouseService);
        inventoryService = module.get<InventoryService>(InventoryService);
        filterService = module.get<FilterService>(FilterService);
        em = module.get<EntityManager>(EntityManager);
        whRepository = module.get<EntityRepository<Warehouse>>(
            getRepositoryToken(Warehouse),
        );

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
});
