import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { InventoryLocationStatus } from '../../common/enum/inventory-location-status.enum';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import { FilterService } from '../../common/module/filter/filter.service';
import { InventoryLocation } from '../../database/entities/inventory-location.entity';
import { LocationService } from '../location/location.service';
import { TenantItemService } from '../tenant-item/tenant-item.service';
import { CreateInventoryLocationDto } from './dto/create-inventory-location.dto';
import { UpdateInventoryLocationDto } from './dto/update-inventory-location.dto';

@Injectable()
export class InventoryLocationService {
    constructor(
        @InjectRepository(InventoryLocation)
        private readonly inventoryLocationRepository: EntityRepository<InventoryLocation>,

        private readonly em: EntityManager,
        private readonly filterService: FilterService,

        @Inject(TenantItemService)
        private readonly tenantItemService: TenantItemService,

        @Inject(LocationService)
        private readonly locationService: LocationService,
    ) {}

    async create(createInventoryLocationDto: CreateInventoryLocationDto) {
        const tenantItem = await this.tenantItemService.findOne(
            createInventoryLocationDto.tenantItemId,
        );

        const location = await this.locationService.findOne(
            createInventoryLocationDto.locationId,
        );

        const inventoryByTenant = await this.inventoryLocationRepository.find({
            tenantItem: tenantItem,
        });

        if (inventoryByTenant.length > 0) {
            const locatedTenantItemQuantity = inventoryByTenant.reduce(
                (acc, curr) => {
                    acc += curr.quantity;
                    return acc;
                },
                0,
            );
            const newLocatedTenantItemQuantity =
                locatedTenantItemQuantity + createInventoryLocationDto.quantity;

            if (newLocatedTenantItemQuantity > tenantItem.quantity) {
                throw new InvalidArgumentException(
                    'quantity exceeds the tenant item quantity',
                );
            }
        }

        let inventoryLocation = inventoryByTenant.find(inventory => {
            return inventory.location === location;
        });

        if (!inventoryLocation) {
            inventoryLocation = new InventoryLocation();
            inventoryLocation.tenantItem = tenantItem;
            inventoryLocation.location = location;
        }

        inventoryLocation.quantity += createInventoryLocationDto.quantity;

        await this.em.persistAndFlush(inventoryLocation);

        return inventoryLocation;
    }

    async search(filterDto: FilterDto) {
        return this.filterService.search<InventoryLocation>(
            InventoryLocation,
            filterDto,
        );
    }

    async findOne(id: number) {
        const inventoryLocation =
            await this.inventoryLocationRepository.findOne({ id });

        if (!inventoryLocation) {
            throw new InvalidArgumentException('invalid inventory location id');
        }

        return inventoryLocation;
    }

    async transferLocation(
        id: number,
        updateInventoryLocationDto: UpdateInventoryLocationDto,
    ) {
        const inventoryLocation = await this.findOne(id);

        let moveToIventoryLocation =
            await this.inventoryLocationRepository.findOne({
                location: updateInventoryLocationDto.newInventoryLocationId,
            });

        if (!moveToIventoryLocation) {
            moveToIventoryLocation = new InventoryLocation();
            const location = await this.locationService.findOne(
                updateInventoryLocationDto.newInventoryLocationId,
            );
            moveToIventoryLocation.location = location;

            moveToIventoryLocation.tenantItem = inventoryLocation.tenantItem;
        }

        moveToIventoryLocation.quantity += updateInventoryLocationDto.quantity;

        inventoryLocation.quantity -= updateInventoryLocationDto.quantity;

        await this.em.persistAndFlush([
            moveToIventoryLocation,
            inventoryLocation,
        ]);
        return inventoryLocation;
    }

    async updateToPositioned(id: number) {
        const inventoryLocation = await this.findOne(id);
        inventoryLocation.status = InventoryLocationStatus.POSITIONED;
        await this.em.persistAndFlush(inventoryLocation);
        return inventoryLocation;
    }
}
