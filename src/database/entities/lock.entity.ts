import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Lock {
  constructor(reason?: string, from?: Date, to?: Date) {
    this.reason = reason;
    this.from = from;
    this.to = to;
  }

  @PrimaryKey()
  id: number;

  @Property()
  reason: string;

  @Property({ nullable: true })
  from?: Date;

  @Property({ nullable: true })
  to?: Date;
}
