import { EntityManager, QueryOrder } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { DateTime } from 'luxon';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import { InventoryLocationStatus } from '../../common/enum/inventory-location-status.enum';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { getTestingModule } from '../../common/mock/testing.module.mock';
import { FilterService } from '../../common/module/filter/filter.service';
import { InventoryLocation } from '../../database/entities/inventory-location.entity';
import { Inventory } from '../../database/entities/inventory.entity';
import { Location } from '../../database/entities/location.entity';
import { TenantItem } from '../../database/entities/tenant-item.entity';
import { Tenant } from '../../database/entities/tenant.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { InventoryService } from '../inventory/inventory.service';
import { LocationService } from '../location/location.service';
import { TenantItemService } from '../tenant-item/tenant-item.service';
import { TenantService } from '../tenant/tenant.service';
import { WarehouseService } from '../warehouse/warehouse.service';
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
    let tenant: Tenant;
    let tenantItem: TenantItem;
    let inventoryLocation: InventoryLocation;
    let tenantItemService: TenantItemService;

    beforeEach(async () => {
        const module: TestingModule = await getTestingModule({
            providers: [
                InventoryLocationService,
                InventoryService,
                LocationService,
                FilterService,
                TenantItemService,
                TenantService,
                WarehouseService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig(InventoryLocation),
                getRepositoryMockConfig(Location),
                getRepositoryMockConfig(Inventory),
                getRepositoryMockConfig(Warehouse),
                getRepositoryMockConfig(TenantItem),
                getRepositoryMockConfig(Tenant),
            ],
        });
        inventoryLocationService = module.get<InventoryLocationService>(
            InventoryLocationService,
        );
        locationService = module.get<LocationService>(LocationService);
        tenantItemService = module.get<TenantItemService>(TenantItemService);
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
            expireDate: DateTime.now().plus({ year: 1 }).toISO(),
            batchCode: 'BATCH123',
            weight: 10,
        });

        tenant = new Tenant();
        tenant.id = 1;
        tenant.name = 'Tenant 1';
        tenant.description = 'Tenant 1 desc';
        tenant.createdAt = new Date();

        warehouse = new Warehouse();
        warehouse.id = 1;
        warehouse.name = 'Warehouse 1';
        warehouse.description = 'Warehouse 1 desc';

        location = new Location();
        location.id = 1;
        location.warehouse = warehouse;
        location.code = 'LOC123';
        location.description = 'Location 1 desc';

        tenantItem = new TenantItem();
        tenantItem.id = 1;
        tenantItem.tenant = tenant;
        tenantItem.inventory = inventory;
        tenantItem.quantity = 200;
        tenantItem.warehouse = warehouse;

        inventoryLocation = new InventoryLocation();
        inventoryLocation.id = 1;
        inventoryLocation.location = location;
        inventoryLocation.quantity = 10;
        inventoryLocation.status = InventoryLocationStatus.POSITIONED;
        inventoryLocation.tenantItem = tenantItem;
        inventoryLocation.createdAt = new Date();
    });

    describe('create', () => {
        it('should create new inventory location', async () => {
            jest.spyOn(locationService, 'findOne').mockImplementation(
                (): Promise<Location> => {
                    return Promise.resolve(location);
                },
            );

            jest.spyOn(tenantItemService, 'findOne').mockImplementation(
                (): Promise<TenantItem> => {
                    return Promise.resolve(tenantItem);
                },
            );

            jest.spyOn(inventoryLocationRepository, 'find').mockImplementation(
                (): any => {
                    return Promise.resolve([]);
                },
            );

            const createDto = {
                tenantItemId: tenantItem.id,
                locationId: location.id,
                quantity: 10,
            };

            const inventoryLocation = new InventoryLocation();

            inventoryLocation.quantity = createDto.quantity;
            inventoryLocation.location = location;
            inventoryLocation.tenantItem = tenantItem;
            jest.spyOn(em, 'persistAndFlush').mockImplementation(() => {
                inventoryLocation.createdAt = new Date();

                return Promise.resolve();
            });

            const result = await inventoryLocationService.create(createDto);
            expect(result).toBeInstanceOf(InventoryLocation);
            expect(result).toMatchObject({
                location: location,
                quantity: createDto.quantity,
                createdAt: expect.any(Date),
            });
        });

        it('should update inventory location quantity', async () => {
            jest.spyOn(tenantItemService, 'findOne').mockImplementation(
                (): any => {
                    return Promise.resolve(tenantItem);
                },
            );

            jest.spyOn(locationService, 'findOne').mockImplementation(() => {
                return Promise.resolve(location);
            });

            jest.spyOn(inventoryLocationRepository, 'find').mockImplementation(
                (): any => {
                    return Promise.resolve([inventoryLocation]);
                },
            );

            const createDto = {
                tenantItemId: tenantItem.id,
                locationId: location.id,
                quantity: 10,
            };

            const inventoryLocation = new InventoryLocation();

            inventoryLocation.quantity = 10;
            inventoryLocation.location = location;
            inventoryLocation.tenantItem = tenantItem;

            jest.spyOn(em, 'persistAndFlush').mockImplementation(() => {
                inventoryLocation.id = 1;
                inventoryLocation.createdAt = new Date();
                return Promise.resolve();
            });

            const result = await inventoryLocationService.create(createDto);
            expect(result).toBeInstanceOf(InventoryLocation);
            expect(result).toMatchObject({
                location: location,
                quantity: 20,
                createdAt: expect.any(Date),
            });
        });

        it('should throw error if quantity exceeds the tenant item quantity', async () => {
            jest.spyOn(tenantItemService, 'findOne').mockImplementation(
                (): any => {
                    return Promise.resolve(tenantItem);
                },
            );

            jest.spyOn(locationService, 'findOne').mockImplementation(() => {
                return Promise.resolve(location);
            });

            jest.spyOn(inventoryLocationRepository, 'find').mockImplementation(
                (): any => {
                    return Promise.resolve([inventoryLocation]);
                },
            );

            const createDto = {
                tenantItemId: tenantItem.id,
                locationId: location.id,
                quantity: 10,
            };

            const inventoryLocation = new InventoryLocation();

            inventoryLocation.quantity = 10000;
            inventoryLocation.location = location;
            inventoryLocation.tenantItem = tenantItem;

            jest.spyOn(em, 'persistAndFlush').mockImplementation(() => {
                inventoryLocation.id = 1;
                inventoryLocation.createdAt = new Date();
                return Promise.resolve();
            });

            const exception = expect(
                inventoryLocationService.create(createDto),
            ).rejects;
            exception.toThrow(InvalidArgumentException);
            exception.toThrowError('quantity exceeds the tenant item quantity');
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
        inventoryLocation.tenantItem = tenantItem;
        inventoryLocation.location = location;

        const inventoryLocation2 = new InventoryLocation();
        inventoryLocation2.id = 2;
        inventoryLocation2.tenantItem = tenantItem;
        inventoryLocation2.location = location;

        const result = [inventoryLocation, inventoryLocation2];
        const paginatedDto = new PaginatedDto();
        paginatedDto.data = result;
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
            inventoryLocation.tenantItem = tenantItem;
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
        inventoryLocation.tenantItem = tenantItem;
        inventoryLocation.location = location;

        jest.spyOn(inventoryLocationRepository, 'findOne').mockResolvedValue(
            inventoryLocation,
        );

        const updateDto = {
            quantity: 10,
            newInventoryLocationId: 2,
        };

        jest.spyOn(em, 'persistAndFlush').mockImplementation(() => {
            inventoryLocation.quantity = updateDto.quantity;
            inventoryLocation.updatedAt = new Date();
            return Promise.resolve();
        });

        expect(
            await inventoryLocationService.transferLocation(
                inventoryLocation.id,
                updateDto,
            ),
        ).toEqual(inventoryLocation);
    });

    it('should update inventory location status', async () => {
        const inventoryLocation = new InventoryLocation();
        inventoryLocation.id = 1;
        inventoryLocation.tenantItem = tenantItem;
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
            await inventoryLocationService.updateToPositioned(
                inventoryLocation.id,
            ),
        ).toEqual(inventoryLocation);
    });
});
