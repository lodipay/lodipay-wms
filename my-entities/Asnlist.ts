import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Asnlist {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  asnCode!: string;

  @Property({ columnType: 'int8' })
  asnStatus!: string;

  @Property({ columnType: 'float8' })
  totalWeight!: string;

  @Property({ columnType: 'float8' })
  totalVolume!: string;

  @Property({ columnType: 'float8' })
  totalCost!: string;

  @Property({ length: 255 })
  supplier!: string;

  @Property({ length: 255 })
  creater!: string;

  @Property({ length: 255 })
  barCode!: string;

  @Property({ length: 255 })
  openid!: string;

  @Property({ columnType: 'jsonb' })
  transportationFee!: any;

  @Property()
  isDelete!: boolean;

  @Property({ length: 6 })
  createTime!: Date;

  @Property({ length: 6, nullable: true })
  updateTime?: Date;

}
