import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';
import { Supplier } from './supplier.entity';

@Entity()
export class Stocklist extends ParentEntity {
    @Property({ length: 255 })
    goodsCode!: string;

    @Property({ length: 255 })
    goodsDesc!: string;

    @Property()
    goodsQty!: number;

    @Property()
    onhandStock!: number;

    @Property()
    canOrderStock!: number;

    @Property()
    orderedStock!: number;

    @Property()
    inspectStock!: number;

    @Property()
    holdStock!: number;

    @Property()
    damageStock!: number;

    @Property()
    asnStock!: number;

    @Property()
    dnStock!: number;

    @Property()
    preLoadStock!: number;

    @Property()
    preSortStock!: number;

    @Property()
    sortedStock!: number;

    @Property()
    pickStock!: number;

    @Property()
    pickedStock!: number;

    @Property()
    backOrderStock!: number;

    @ManyToOne(() => Supplier)
    supplier: Supplier;

    @Property({ length: 255 })
    openid!: string;
}
