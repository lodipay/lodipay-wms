import { QueryOrder } from '@mikro-orm/core';
import { TestingModule } from '@nestjs/testing';
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
import { TenantItem } from '../../database/entities/tenant-item.entity';
import { Tenant } from '../../database/entities/tenant.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { InventoryService } from '../inventory/inventory.service';
import { LocationService } from '../location/location.service';
import { TenantItemService } from '../tenant-item/tenant-item.service';
import { TenantService } from '../tenant/tenant.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { InventoryLocationController } from './inventory-location.controller';
import { InventoryLocationService } from './inventory-location.service';

describe('InventoryLocationController', () => {
    let controller: InventoryLocationController;
    let inventoryLocationService: InventoryLocationService;
    let inventory: Inventory;
    let location: Location;
    let warehouse: Warehouse;
    let tenantItem: TenantItem;
    let tenant: Tenant;

    beforeEach(async () => {
        const module: TestingModule = await getTestingModule({
            controllers: [InventoryLocationController],
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

        controller = module.get<InventoryLocationController>(
            InventoryLocationController,
        );
        inventoryLocationService = module.get<InventoryLocationService>(
            InventoryLocationService,
        );

        tenant = new Tenant();
        tenant.id = 1;
        tenant.name = 'Tenant 1';
        tenant.description = 'Tenant 1 desc';
        tenant.createdAt = new Date();

        inventory = new Inventory();
        inventory.sku = 'SKU123123';
        inventory.name = 'Female Shirt';
        inventory.description =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        inventory.quantity = 10;
        inventory.expireDate = new Date();
        inventory.batchCode = 'BATCH123';
        inventory.weight = 10;

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
        tenantItem.tenant = tenant;
        tenantItem.quantity = 100;
        tenantItem.inventory = inventory;
        tenantItem.quantity = 200;
        tenantItem.warehouse = warehouse;
    });

    it('should create new inventory location', async () => {
        const createDto = {
            tenantItemId: 1,
            locationId: 1,
            quantity: 10,
        };

        const newInventoryLocation = new InventoryLocation();
        newInventoryLocation.tenantItem = tenantItem;
        newInventoryLocation.location = location;
        newInventoryLocation.createdAt = new Date();

        jest.spyOn(inventoryLocationService, 'create').mockImplementation(
            () => {
                newInventoryLocation.quantity = createDto.quantity;
                return Promise.resolve(newInventoryLocation);
            },
        );

        const result = await controller.create(createDto);
        expect(result).toBeInstanceOf(InventoryLocation);
        expect(result).toEqual(newInventoryLocation);
    });

    it('should find inventory location by query', async () => {
        const query = {
            page: 1,
            limit: 10,
            query: {
                filter: {
                    inventory: {
                        id: inventory.id,
                    },
                },
                order: {
                    id: QueryOrder.ASC,
                },
                populate: ['inventory'],
            },
        };

        const newInventoryLocation = new InventoryLocation();
        newInventoryLocation.id = 1;
        newInventoryLocation.tenantItem = tenantItem;
        newInventoryLocation.location = location;
        newInventoryLocation.createdAt = new Date();

        const newInventoryLocation2 = new InventoryLocation();
        newInventoryLocation.id = 2;
        newInventoryLocation.tenantItem = tenantItem;
        newInventoryLocation.location = location;
        newInventoryLocation.createdAt = new Date();

        const result = [newInventoryLocation, newInventoryLocation2];

        const paginatedDto = new PaginatedDto();
        jest.spyOn(inventoryLocationService, 'search').mockImplementation(
            (): any => {
                paginatedDto.result = result;
                paginatedDto.page = query.page;
                paginatedDto.limit = query.limit;
                paginatedDto.total = 10;
                paginatedDto.totalPage = 1;
                return Promise.resolve(paginatedDto);
            },
        );

        expect(await controller.search(query)).toStrictEqual(paginatedDto);
    });

    it('should find inventory location by id', async () => {
        const newInventoryLocation = new InventoryLocation();
        newInventoryLocation.id = 1;
        newInventoryLocation.tenantItem = tenantItem;
        newInventoryLocation.location = location;
        newInventoryLocation.createdAt = new Date();

        jest.spyOn(inventoryLocationService, 'findOne').mockImplementation(
            () => {
                return Promise.resolve(newInventoryLocation);
            },
        );

        expect(await controller.findOne(`1`)).toStrictEqual(
            newInventoryLocation,
        );
    });

    it('should remove inventory location by id', async () => {
        const newInventoryLocation = new InventoryLocation();
        newInventoryLocation.id = 1;
        newInventoryLocation.tenantItem = tenantItem;
        newInventoryLocation.location = location;
        newInventoryLocation.createdAt = new Date();

        jest.spyOn(inventoryLocationService, 'remove').mockImplementation(
            () => {
                return Promise.resolve('deleted');
            },
        );

        expect(await controller.remove(`1`)).toBe('deleted');
    });

    it('should update inventory status by id', async () => {
        const updateDto = {
            quantity: 10,
        };

        const newInventoryLocation = new InventoryLocation();
        newInventoryLocation.id = 1;
        newInventoryLocation.tenantItem = tenantItem;
        newInventoryLocation.location = location;
        newInventoryLocation.createdAt = new Date();

        jest.spyOn(inventoryLocationService, 'findOne').mockImplementation(
            () => {
                return Promise.resolve(newInventoryLocation);
            },
        );

        jest.spyOn(
            inventoryLocationService,
            'updateToPositioned',
        ).mockImplementation(() => {
            newInventoryLocation.status = InventoryLocationStatus.POSITIONED;
            return Promise.resolve(newInventoryLocation);
        });

        expect(await controller.update(`1`, updateDto)).toStrictEqual(
            newInventoryLocation,
        );
    });
});
