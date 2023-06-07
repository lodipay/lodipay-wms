import {
    Entity,
    Filter,
    ManyToOne,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
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
    description: string;

    @Property()
    quantity = 0;

    @ManyToOne(() => Tenant)
    tenant: Tenant;

    @ManyToOne(() => Warehouse)
    warehouse: Warehouse;

    @ManyToOne({
        entity: () => Inventory,
    })
    inventory: Inventory;
}
