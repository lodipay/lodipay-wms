import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';
import { AsnStatus } from '@/common/enum/asn-status.enum';
import { Supplier } from './supplier.entity';
import { Asnlist } from './asn-list.entity';

@Entity()
export class Asndetail extends ParentEntity{

  @Property({ length: 64 })
  asnCode!: string;

  @Property({ default: AsnStatus.PENDINGARRIVAL })
  asnStatus: AsnStatus;

  @ManyToOne({ entity: () => Supplier })
  supplier!: Supplier;

  @Property({ length: 64 })
  goodsCode!: string;

  @Property({ length: 255 })
  goodsDesc!: string;

  @Property({length: 8})
  goodsQty!: number;

  @Property({length: 8})
  goodsActualQty!: number;

  @Property({length: 8})
  sortedQty!: number;

  @Property({length: 8})
  goodsShortageQty!: number;

  @Property({length: 8})
  goodsMoreQty!: number;

  @Property({length: 8})
  goodsDamageQty!: number;

  @Property()
  goodsWeight!: number;

  @Property()
  goodsVolume!: number;

  @Property()
  goodsCost!: number;

  @Property({ length: 64 })
  openId!: string;

  @ManyToOne({ entity: () => Asnlist })
  asnList!: Asnlist;

}
