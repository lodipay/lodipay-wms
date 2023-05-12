import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Destination } from './destination.entity';
import { ParentEntity } from './parent.entity';

@Entity()
export class Order extends ParentEntity {
  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  createdBy?: string;

  @ManyToOne({ entity: () => Destination })
  from: Destination;

  @ManyToOne({ entity: () => Destination })
  to: Destination;

  constructor(name?: string, description?: string, createdBy?: string) {
    super();
    this.name = name;
    this.description = description;
    this.createdBy = createdBy;
  }
}
