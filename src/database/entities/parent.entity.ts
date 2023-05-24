import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class ParentEntity {
    @PrimaryKey()
    id: number;

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date(), nullable: true })
    updatedAt: Date;
}
