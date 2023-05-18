import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Destination } from './destination.entity';
import { OrderItem } from './order-item.entity';
import { ParentEntity } from './parent.entity';

export enum OrderStatus {
  NEW = 'NEW',
  READY = 'READY',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  DONE = 'DONE',
  CANCELED = 'CANCELED',
  RETURNED = 'RETURNED',
}

@Entity()
export class Order extends ParentEntity {
  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  createdBy?: string;

  @Enum(() => OrderStatus)
  status = OrderStatus.NEW;

  @ManyToOne({ entity: () => Destination })
  from: Destination;

  @ManyToOne({ entity: () => Destination })
  to: Destination;

  @OneToMany({
    entity: () => OrderItem,
    mappedBy: 'order',
    orphanRemoval: true,
  })
  orderItems = new Collection<OrderItem>(this);

  constructor(name?: string, description?: string, createdBy?: string) {
    super();
    this.name = name;
    this.description = description;
    this.createdBy = createdBy;
  }
}
