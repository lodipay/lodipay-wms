import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { InventoryLocationStatus } from '../../common/enum/inventory-location-status.enum';
import { Inventory } from './inventory.entity';
import { Location } from './location.entity';
import { ParentEntity } from './parent.entity';

@Entity()
export class InventoryLocation extends ParentEntity {
    @Property()
    quantity: number;

    @Property()
    status?: InventoryLocationStatus;

    @ManyToOne({
        entity: () => Location,
    })
    location: Location;

    @ManyToOne({
        entity: () => Inventory,
    })
    inventory: Inventory;
}
