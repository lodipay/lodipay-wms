import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Stocklist {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  goodsCode!: string;

  @Property({ length: 255 })
  goodsDesc!: string;

  @Property({ columnType: 'int8' })
  goodsQty!: string;

  @Property({ columnType: 'int8' })
  onhandStock!: string;

  @Property({ columnType: 'int8' })
  canOrderStock!: string;

  @Property({ columnType: 'int8' })
  orderedStock!: string;

  @Property({ columnType: 'int8' })
  inspectStock!: string;

  @Property({ columnType: 'int8' })
  holdStock!: string;

  @Property({ columnType: 'int8' })
  damageStock!: string;

  @Property({ columnType: 'int8' })
  asnStock!: string;

  @Property({ columnType: 'int8' })
  dnStock!: string;

  @Property({ columnType: 'int8' })
  preLoadStock!: string;

  @Property({ columnType: 'int8' })
  preSortStock!: string;

  @Property({ columnType: 'int8' })
  sortedStock!: string;

  @Property({ columnType: 'int8' })
  pickStock!: string;

  @Property({ columnType: 'int8' })
  pickedStock!: string;

  @Property({ columnType: 'int8' })
  backOrderStock!: string;

  @Property({ length: 255 })
  supplier!: string;

  @Property({ length: 255 })
  openid!: string;

  @Property({ length: 6 })
  createTime!: Date;

  @Property({ length: 6, nullable: true })
  updateTime?: Date;

}
