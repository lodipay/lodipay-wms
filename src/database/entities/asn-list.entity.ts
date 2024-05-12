import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';
import { AsnStatus } from '@/common/enum/asn-status.enum';
import { Supplier } from './supplier.entity';
import { Asndetail } from './asn-detail.entity';

@Entity()
export class Asnlist extends ParentEntity{

  @Property({ length: 64 })
  asnCode!: string;

  @Property({ default: AsnStatus.PREDELIVERY })
  asnStatus?: AsnStatus;

  @Property({ nullable: true })
  totalWeight?: number;

  @Property({ nullable: true })
  totalVolume?: number;

  @Property({ nullable: true })
  totalCost?: number;

  @ManyToOne({ entity: () => Supplier })
  supplier!: Supplier;

  @Property({ length: 64 })
  barCode!: string;

  @Property({ length: 64 })
  openId!: string;

  @Property({ columnType: 'jsonb' })
  transportationFee?: any;

  @OneToMany({ entity: () => Asndetail, mappedBy: 'asnList' })
  asndetail = new Collection<Asndetail>(this);

}
