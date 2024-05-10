import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';
import { AsnStatus } from '@/common/enum/asn-status.enum';
import { Supplier } from './supplier.entity';
import { Asnlist } from './asnlist.entity';

@Entity()
export class Asndetail extends ParentEntity{

  @Property({ length: 64 })
  asnCode!: string;

  @Property({ default: AsnStatus.PREDELIVERY })
  asnStatus: AsnStatus;

  @ManyToOne({ entity: () => Supplier })
  supplier!: Supplier;

  @Property({ length: 64 })
  goodsCode!: string;

  @Property({ length: 255 })
  goodsDesc!: string;

  @Property({length: 8})
  goodsQty!: string;

  @Property({length: 8})
  goodsActualQty!: string;

  @Property({length: 8})
  sortedQty!: string;

  @Property({length: 8})
  goodsShortageQty!: string;

  @Property({length: 8})
  goodsMoreQty!: string;

  @Property({length: 8})
  goodsDamageQty!: string;

  @Property()
  goodsWeight!: string;

  @Property()
  goodsVolume!: string;

  @Property()
  goodsCost!: string;

  @Property({ length: 255 })
  openId!: string;

  @ManyToOne({ entity: () => Asnlist })
  asnList!: Asnlist;

}
