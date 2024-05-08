import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';
import { AsnStatus } from '@/common/enum/asn-status.enum';
import { Supplier } from './supplier.entity';

@Entity()
export class Asnlist extends ParentEntity{

  @Property({ length: 64 })
  asnCode!: string;

  @Property()
  asnStatus: AsnStatus;

  @Property({ nullable: true })
  totalWeight!: number;

  @Property({ nullable: true })
  totalVolume!: number;

  @Property({ nullable: true })
  totalCost!: number;

  @ManyToOne({ entity: () => Supplier })
  supplier!: Supplier;

  @Property({ length: 64 })
  barCode!: string;

  @Property({ length: 64 })
  openid!: string;

  @Property({ columnType: 'jsonb' })
  transportationFee!: any;

}
