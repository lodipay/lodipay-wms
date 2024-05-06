import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Pickinglist {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  dnCode!: string;

  @Property({ length: 255 })
  binName!: string;

  @Property({ length: 255 })
  goodsCode!: string;

  @Property({ columnType: 'int2' })
  pickingStatus!: number;

  @Property({ columnType: 'int8' })
  pickQty!: string;

  @Property({ columnType: 'int8' })
  pickedQty!: string;

  @Property({ length: 255 })
  creater!: string;

  @Property({ length: 255 })
  tCode!: string;

  @Property({ length: 255 })
  openid!: string;

  @Property({ length: 6 })
  createTime!: Date;

  @Property({ length: 6, nullable: true })
  updateTime?: Date;

}
