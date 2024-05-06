import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Goods {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  goodsCode!: string;

  @Property({ length: 255 })
  goodsDesc!: string;

  @Property({ length: 255 })
  goodsSupplier!: string;

  @Property({ columnType: 'float8' })
  goodsWeight!: string;

  @Property({ columnType: 'float8' })
  goodsW!: string;

  @Property({ columnType: 'float8' })
  goodsD!: string;

  @Property({ columnType: 'float8' })
  goodsH!: string;

  @Property({ columnType: 'float8' })
  unitVolume!: string;

  @Property({ length: 255 })
  goodsUnit!: string;

  @Property({ length: 255 })
  goodsClass!: string;

  @Property({ length: 255 })
  goodsBrand!: string;

  @Property({ length: 255 })
  goodsColor!: string;

  @Property({ length: 255 })
  goodsShape!: string;

  @Property({ length: 255 })
  goodsSpecs!: string;

  @Property({ length: 255 })
  goodsOrigin!: string;

  @Property({ columnType: 'int8' })
  safetyStock!: string;

  @Property({ columnType: 'float8' })
  goodsCost!: string;

  @Property({ columnType: 'float8' })
  goodsPrice!: string;

  @Property({ length: 255 })
  creater!: string;

  @Property({ length: 255 })
  barCode!: string;

  @Property({ length: 255 })
  openid!: string;

  @Property()
  isDelete!: boolean;

  @Property({ length: 6 })
  createTime!: Date;

  @Property({ length: 6, nullable: true })
  updateTime?: Date;

}
