import { EntityManager, QueryOrder } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { DateTime } from 'luxon';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import { InventoryLocationStatus } from '../../common/enum/inventory-location-status.enum';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { getTestingModule } from '../../common/mock/testing.module.mock';
import { FilterService } from '../../common/module/filter/filter.service';
import { InventoryLocation } from '../../database/entities/inventory-location.entity';
import { Inventory } from '../../database/entities/inventory.entity';
import { Location } from '../../database/entities/location.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { InventoryService } from '../inventory/inventory.service';
import { LocationService } from '../location/location.service';
import { InventoryLocationService } from './inventory-location.service';

describe('InventoryLocationService', () => {
    let inventoryLocationService: InventoryLocationService;
    let locationService: LocationService;
    let inventoryService: InventoryService;
    let em: EntityManager;
    let inventoryLocationRepository: EntityRepository<InventoryLocation>;
    let inventory: Inventory;
    let warehouse: Warehouse;
    let location: Location;
    let filterService: FilterService;

    beforeEach(async () => {
        const module: TestingModule = await getTestingModule({
            providers: [
                InventoryLocationService,
                InventoryService,
                LocationService,
                FilterService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig(InventoryLocation),
                getRepositoryMockConfig(Location),
                getRepositoryMockConfig(Inventory),
                getRepositoryMockConfig(Warehouse),
            ],
        });
        inventoryLocationService = module.get<InventoryLocationService>(
            InventoryLocationService,
        );
        locationService = module.get<LocationService>(LocationService);
        inventoryService = module.get<InventoryService>(InventoryService);
        inventoryService = module.get<InventoryService>(InventoryService);
        filterService = module.get<FilterService>(FilterService);
        em = module.get<EntityManager>(EntityManager);
        inventoryLocationRepository = module.get<
            EntityRepository<InventoryLocation>
        >(getRepositoryToken(InventoryLocation));

        inventory = plainToClass(Inventory, {
            sku: 'SKU123123',
            name: 'Female Shirt',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            quantity: 10,
            expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
            batchCode: 'BATCH123',
            weight: 10,
        });

        warehouse = new Warehouse();
        warehouse.id = 1;
        warehouse.name = 'Warehouse 1';
        warehouse.description = 'Warehouse 1 desc';

        location = new Location();
        location.id = 1;
        location.warehouse = warehouse;
        location.code = 'LOC123';
        location.description = 'Location 1 desc';
    });

    it('should be create new inventory location', async () => {
        jest.spyOn(locationService, 'findOne').mockImplementation(() => {
            return Promise.resolve(location);
        });

        jest.spyOn(inventoryService, 'findOne').mockImplementation(() => {
            return Promise.resolve(inventory);
        });

        const inventoryLocation = new InventoryLocation();
        inventoryLocation.inventory = inventory;
        inventoryLocation.location = location;

        const createDto = {
            inventoryId: inventory.id,
            locationId: location.id,
            quantity: 10,
        };

        jest.spyOn(em, 'persistAndFlush').mockImplementation(() => {
            inventoryLocation.quantity = createDto.quantity;
            inventoryLocation.createdAt = new Date();
            return Promise.resolve();
        });

        expect(await inventoryLocationService.create(createDto)).toMatchObject({
            ...inventoryLocation,
            createdAt: expect.any(Date),
        });
    });

    it('search', async () => {
        const query = {
            page: 1,
            limit: 10,
            query: {
                filter: {
                    location: {
                        id: 1,
                    },
                },
                order: {
                    name: QueryOrder.DESC,
                },
            },
        };

        const inventoryLocation = new InventoryLocation();
        inventoryLocation.id = 1;
        inventoryLocation.inventory = inventory;
        inventoryLocation.location = location;

        const inventoryLocation2 = new InventoryLocation();
        inventoryLocation2.id = 2;
        inventoryLocation2.inventory = inventory;
        inventoryLocation2.location = location;

        const result = [inventoryLocation, inventoryLocation2];
        const paginatedDto = new PaginatedDto();
        paginatedDto.result = result;
        paginatedDto.page = query.page;
        paginatedDto.limit = query.limit;
        paginatedDto.total = 100;
        paginatedDto.totalPage = 10;
        jest.spyOn(filterService, 'search').mockImplementation(() => {
            return Promise.resolve(paginatedDto);
        });

        expect(await inventoryLocationService.search(query)).toMatchObject(
            paginatedDto,
        );
    });

    describe('find', () => {
        it('should find one by id', async () => {
            const inventoryLocation = new InventoryLocation();
            inventoryLocation.id = 1;
            inventoryLocation.inventory = inventory;
            inventoryLocation.location = location;

            jest.spyOn(
                inventoryLocationRepository,
                'findOne',
            ).mockResolvedValue(inventoryLocation);

            expect(
                await inventoryLocationService.findOne(inventoryLocation.id),
            ).toEqual(inventoryLocation);
        });

        it('should throw error when not found', async () => {
            jest.spyOn(
                inventoryLocationRepository,
                'findOne',
            ).mockResolvedValue(null);

            expect(inventoryLocationService.findOne(1)).rejects.toThrowError();
        });
    });

    it('should update inventory location', async () => {
        const inventoryLocation = new InventoryLocation();
        inventoryLocation.id = 1;
        inventoryLocation.inventory = inventory;
        inventoryLocation.location = location;

        jest.spyOn(inventoryLocationRepository, 'findOne').mockResolvedValue(
            inventoryLocation,
        );

        const updateDto = {
            quantity: 10,
        };

        jest.spyOn(em, 'persistAndFlush').mockImplementation(() => {
            inventoryLocation.quantity = updateDto.quantity;
            inventoryLocation.updatedAt = new Date();
            return Promise.resolve();
        });

        expect(
            await inventoryLocationService.update(
                inventoryLocation.id,
                updateDto,
            ),
        ).toEqual(inventoryLocation);
    });

    it('should delete inventory location', async () => {
        const inventoryLocation = new InventoryLocation();
        inventoryLocation.id = 1;
        inventoryLocation.inventory = inventory;
        inventoryLocation.location = location;

        jest.spyOn(inventoryLocationRepository, 'findOne').mockResolvedValue(
            inventoryLocation,
        );

        jest.spyOn(em, 'removeAndFlush').mockImplementation(() => {
            return Promise.resolve();
        });

        expect(
            await inventoryLocationService.remove(inventoryLocation.id),
        ).toEqual('deleted');
    });

    it('should update inventory location status', async () => {
        const inventoryLocation = new InventoryLocation();
        inventoryLocation.id = 1;
        inventoryLocation.inventory = inventory;
        inventoryLocation.location = location;

        jest.spyOn(inventoryLocationRepository, 'findOne').mockResolvedValue(
            inventoryLocation,
        );

        jest.spyOn(em, 'persistAndFlush').mockImplementation(() => {
            inventoryLocation.status = InventoryLocationStatus.POSITIONED;
            inventoryLocation.updatedAt = new Date();
            return Promise.resolve();
        });

        expect(
            await inventoryLocationService.updatePositionStatus(
                inventoryLocation.id,
            ),
        ).toEqual(inventoryLocation);
    });
});
