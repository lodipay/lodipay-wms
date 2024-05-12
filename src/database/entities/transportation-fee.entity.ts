import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';

@Entity()
export class Transportationfee extends ParentEntity {

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
  openid!: string;

}
