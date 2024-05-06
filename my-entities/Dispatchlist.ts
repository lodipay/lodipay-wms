import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Dispatchlist {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  driverName!: string;

  @Property({ length: 255 })
  dnCode!: string;

  @Property({ columnType: 'int8' })
  contact!: string;

  @Property({ length: 255 })
  creater!: string;

  @Property({ length: 255 })
  openid!: string;

  @Property({ length: 6 })
  createTime!: Date;

  @Property({ length: 6, nullable: true })
  updateTime?: Date;

}
