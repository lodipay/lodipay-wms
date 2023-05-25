import { Entity, Filter, OneToMany, OneToOne, Property } from '@mikro-orm/core';
import { Order } from './order.entity';
import { ParentEntity } from './parent.entity';
import { Warehouse } from './warehouse.entity';

@Entity()
@Filter({ name: 'mainFilter', cond: args => args })
export class Destination extends ParentEntity {
    constructor(name: string, description?: string) {
        super();
        this.name = name;
        this.description = description;
    }

    @Property()
    name: string;

    @Property()
    description: string;

    @OneToOne(() => Warehouse, warehouse => warehouse.destination, {
        owner: true,
    })
    warehouse?: Warehouse;

    @OneToMany(() => Order, order => order.from)
    from?: Order;

    @OneToMany(() => Order, order => order.to)
    to?: Order;
}
