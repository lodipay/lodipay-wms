import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';
import { Dnlist } from './dn-list';

@Entity()
export class Dndetail extends ParentEntity {

  @Property({ length: 64 })
  dnCode!: string;

  @Property({ columnType: 'int8' })
  dnStatus!: string;

  @Property({ length: 255 })
  customer!: string;

  @Property({ length: 64 })
  goodsCode!: string;

  @Property({ length: 255 })
  goodsDesc!: string;

  @Property()
  goodsQty!: number;

  @Property()
  pickQty!: number;

  @Property()
  pickedQty!: number;

  @Property()
  intransitQty!: number;

  @Property()
  deliveryActualQty!: number;

  @Property()
  deliveryShortageQty!: number;

  @Property()
  deliveryMoreQty!: number;

  @Property()
  deliveryDamageQty!: number;

  @Property()
  goodsWeight!: number;

  @Property()
  goodsVolume!: number;

  @Property()
  goodsCost!: number;

  @Property()
  backOrderLabel!: boolean;

  @Property({ length: 255 })
  openId!: string;

  @ManyToOne({ entity: () => Dnlist })
  dnList!: Dnlist;

}
