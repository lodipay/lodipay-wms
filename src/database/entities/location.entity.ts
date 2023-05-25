import {
    Entity,
    ManyToOne,
    PrimaryKey,
    Property,
    Unique,
} from '@mikro-orm/core';
import { Warehouse } from './warehouse.entity';

@Entity()
export class Location {
    constructor(code?: string, warehouse?: Warehouse, description?: string) {
        this.code = code;
        this.description = description;
        this.warehouse = warehouse;
    }

    @PrimaryKey()
    id!: number;

    @Property()
    @Unique()
    code: string;

    @Property({ nullable: true })
    description?: string;

    @ManyToOne(() => Warehouse)
    warehouse!: Warehouse;
}
