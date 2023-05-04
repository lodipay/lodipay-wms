import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Warehouse {
    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    @Property()
    description: string;
}
