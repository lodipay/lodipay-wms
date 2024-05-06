import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Dndetail {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  dnCode!: string;

  @Property({ columnType: 'int8' })
  dnStatus!: string;

  @Property({ length: 255 })
  customer!: string;

  @Property({ length: 255 })
  goodsCode!: string;

  @Property({ length: 255 })
  goodsDesc!: string;

  @Property({ columnType: 'int8' })
  goodsQty!: string;

  @Property({ columnType: 'int8' })
  pickQty!: string;

  @Property({ columnType: 'int8' })
  pickedQty!: string;

  @Property({ columnType: 'int8' })
  intransitQty!: string;

  @Property({ columnType: 'int8' })
  deliveryActualQty!: string;

  @Property({ columnType: 'int8' })
  deliveryShortageQty!: string;

  @Property({ columnType: 'int8' })
  deliveryMoreQty!: string;

  @Property({ columnType: 'int8' })
  deliveryDamageQty!: string;

  @Property({ columnType: 'float8' })
  goodsWeight!: string;

  @Property({ columnType: 'float8' })
  goodsVolume!: string;

  @Property({ columnType: 'float8' })
  goodsCost!: string;

  @Property({ length: 255 })
  creater!: string;

  @Property()
  backOrderLabel!: boolean;

  @Property({ length: 255 })
  openid!: string;

  @Property()
  isDelete!: boolean;

  @Property({ length: 6 })
  createTime!: Date;

  @Property({ length: 6, nullable: true })
  updateTime?: Date;

}
