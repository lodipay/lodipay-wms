import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Capital {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  capitalName!: string;

  @Property({ columnType: 'int8' })
  capitalQty!: string;

  @Property({ columnType: 'float8' })
  capitalCost!: string;

  @Property({ length: 255 })
  creater!: string;

  @Property({ length: 255 })
  openid!: string;

  @Property()
  isDelete!: boolean;

  @Property({ length: 6 })
  createTime!: Date;

  @Property({ length: 6, nullable: true })
  updateTime?: Date;

}
