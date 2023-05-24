import {
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    Property,
} from '@mikro-orm/core';
import { Inventory } from './inventory.entity';
import { Order } from './order.entity';
import { ParentEntity } from './parent.entity';

@Entity()
export class OrderItem extends ParentEntity {
    @Property()
    description?: string;

    @Property()
    inventoryAmount: number;

    @ManyToOne({ entity: () => Order })
    order!: Order;

    @OneToMany({
        entity: () => Inventory,
        mappedBy: 'orderItem',
        orphanRemoval: false,
    })
    inventories = new Collection<Inventory>(this);
}
