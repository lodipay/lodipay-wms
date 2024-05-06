import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Transportationfee {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  sendCity!: string;

  @Property({ length: 255 })
  receiverCity!: string;

  @Property({ columnType: 'float8' })
  weightFee!: string;

  @Property({ columnType: 'float8' })
  volumeFee!: string;

  @Property({ columnType: 'float8' })
  minPayment!: string;

  @Property({ length: 255 })
  transportationSupplier!: string;

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
