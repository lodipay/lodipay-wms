import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Cyclecountday {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  openid!: string;

  @Property()
  cyclecountStatus!: number;

  @Property({ length: 255 })
  binName!: string;

  @Property({ length: 255 })
  goodsCode!: string;

  @Property({ columnType: 'int8' })
  goodsQty!: string;

  @Property({ columnType: 'int8' })
  physicalInventory!: string;

  @Property({ columnType: 'int8' })
  difference!: string;

  @Property({ length: 255 })
  creater!: string;

  @Property({ length: 255 })
  tCode!: string;

  @Property({ length: 6 })
  createTime!: Date;

  @Property({ length: 6, nullable: true })
  updateTime?: Date;

}
