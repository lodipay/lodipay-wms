import {
    Collection,
    Entity,
    OneToMany,
    OneToOne,
    Property,
    Unique,
} from '@mikro-orm/core';
import { Destination } from './destination.entity';
import { Location } from './location.entity';
import { ParentEntity } from './parent.entity';
import { TenantItem } from './tenant-item.entity';

@Entity()
export class Warehouse extends ParentEntity {
    /**
     * Warehouse name
     *
     * @example 'WH1'
     */
    @Property()
    @Unique()
    name: string;

    /**
     * Warehouse description
     *
     * @example 'warehouse 1'
     */
    @Property()
    description: string;

    @OneToMany({
        entity: () => Location,
        mappedBy: 'warehouse',
    })
    locations = new Collection<Location>(this);

    @OneToOne(() => Destination, destination => destination.warehouse)
    destination?: Destination;

    @OneToMany(() => TenantItem, 'warehouse')
    tenantItem = new Collection<TenantItem>(this);

    constructor(name?: string, description?: string) {
        super();
        this.name = name;
        this.description = description;
    }
}
