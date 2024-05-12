import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { expand } from 'rxjs';
import { ParentEntity } from './parent.entity';
import { Dndetail } from './dn-detail.entity';

@Entity()
export class Dnlist extends ParentEntity {

  @Property({ length: 64 })
  dnCode!: string;

  @Property({ columnType: 'int8' })
  dnStatus!: string;

  @Property()
  totalWeight?: number;

  @Property()
  totalVolume?: number;

  @Property()
  totalCost?: number;

  @Property({ length: 255 })
  customer!: string;

  @Property({ length: 64 })
  barCode!: string;

  @Property()
  backOrderLabel!: boolean;

  @Property({ length: 64 })
  openId!: string;

  @Property({ columnType: 'jsonb' })
  transportationFee?: any;

  @OneToMany({ entity: () => Dndetail, mappedBy: 'dnList' })
  dndetail = new Collection<Dndetail>(this);
}
