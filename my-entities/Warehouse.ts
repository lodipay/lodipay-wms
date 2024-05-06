import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Warehouse {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  warehouseName!: string;

  @Property({ length: 255 })
  warehouseCity!: string;

  @Property({ length: 255 })
  warehouseAddress!: string;

  @Property({ length: 255 })
  warehouseContact!: string;

  @Property({ length: 255 })
  warehouseManager!: string;

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
