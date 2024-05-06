import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Qtyrecorder {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  openid!: string;

  @Property({ length: 255 })
  modeCode!: string;

  @Property({ length: 255 })
  binName!: string;

  @Property({ length: 255 })
  goodsCode!: string;

  @Property({ length: 255 })
  goodsDesc!: string;

  @Property({ columnType: 'int8' })
  goodsQty!: string;

  @Property({ length: 255 })
  storeCode!: string;

  @Property({ length: 255 })
  creater!: string;

  @Property({ length: 6 })
  createTime!: Date;

  @Property({ length: 6, nullable: true })
  updateTime?: Date;

}
