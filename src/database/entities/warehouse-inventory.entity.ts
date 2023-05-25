import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Inventory } from './inventory.entity';
import { ParentEntity } from './parent.entity';
import { Warehouse } from './warehouse.entity';

@Entity({ tableName: 't_warehouse_inventory' })
export class WarehouseInventory extends ParentEntity {
    @ManyToOne({ entity: () => Warehouse })
    warehouse: Warehouse;

    @ManyToOne({ entity: () => Inventory })
    inventory: Inventory;

    @Property()
    quantity: number;
}
