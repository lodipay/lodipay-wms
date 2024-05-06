import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Asndetail {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  asnCode!: string;

  @Property({ columnType: 'int8' })
  asnStatus!: string;

  @Property({ length: 255 })
  supplier!: string;

  @Property({ length: 255 })
  goodsCode!: string;

  @Property({ length: 255 })
  goodsDesc!: string;

  @Property({ columnType: 'int8' })
  goodsQty!: string;

  @Property({ columnType: 'int8' })
  goodsActualQty!: string;

  @Property({ columnType: 'int8' })
  sortedQty!: string;

  @Property({ columnType: 'int8' })
  goodsShortageQty!: string;

  @Property({ columnType: 'int8' })
  goodsMoreQty!: string;

  @Property({ columnType: 'int8' })
  goodsDamageQty!: string;

  @Property({ columnType: 'float8' })
  goodsWeight!: string;

  @Property({ columnType: 'float8' })
  goodsVolume!: string;

  @Property({ columnType: 'float8' })
  goodsCost!: string;

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
