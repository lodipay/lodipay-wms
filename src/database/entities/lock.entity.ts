import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Lock {
    constructor(reason?: string, activeFrom?: Date, activeTo?: Date) {
        this.reason = reason;
        this.activeFrom = activeFrom;
        this.activeTo = activeTo;
    }

    @PrimaryKey()
    id: number;

    @Property()
    reason: string;

    @Property({ nullable: true })
    activeFrom?: Date;

    @Property({ nullable: true })
    activeTo?: Date;
}
