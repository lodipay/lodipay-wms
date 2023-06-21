import {
    Collection,
    Entity,
    Filter,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { InventoryLocation } from './inventory-location.entity';
import { Inventory } from './inventory.entity';
import { ParentEntity } from './parent.entity';
import { Tenant } from './tenant.entity';
import { Warehouse } from './warehouse.entity';

@Entity()
@Filter({ name: 'mainFilter', cond: args => args })
export class TenantItem extends ParentEntity {
    @PrimaryKey()
    id: number;

    @Property()
    description?: string;

    @Property()
    quantity = 0;

    @Property()
    damagedQuantity?: number;

    @ManyToOne(() => Tenant)
    tenant: Tenant;

    @ManyToOne(() => Warehouse)
    warehouse: Warehouse;

    @ManyToOne({
        entity: () => Inventory,
    })
    inventory: Inventory;

    @OneToMany({
        entity: () => InventoryLocation,
        mappedBy: 'tenantItem',
    })
    inventoryLocations = new Collection<InventoryLocation>(this);
}
