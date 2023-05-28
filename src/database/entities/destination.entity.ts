import { Entity, Filter, OneToMany, OneToOne, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';
import { Transfer } from './transfer.entity';
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

    @OneToMany(() => Transfer, transfer => transfer.from)
    from?: Transfer;

    @OneToMany(() => Transfer, transfer => transfer.to)
    to?: Transfer;
}
