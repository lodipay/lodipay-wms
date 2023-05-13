import { Entity, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
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

  @OneToOne(() => Inventory, inventory => inventory.orderItem, {
    owner: true,
    onUpdateIntegrity: 'set null',
  })
  inventory!: Inventory;
}
