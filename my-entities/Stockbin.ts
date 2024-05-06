import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Stockbin {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  binName!: string;

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

  @Property({ length: 255 })
  binSize!: string;

  @Property({ length: 255 })
  binProperty!: string;

  @Property({ length: 255 })
  tCode!: string;

  @Property({ length: 255 })
  openid!: string;

  @Property({ length: 6 })
  createTime!: Date;

  @Property({ length: 6, nullable: true })
  updateTime?: Date;

}
