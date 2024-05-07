import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { GoodsBrand } from './goods-brand.entity';
import { GoodsClass } from './goods-class.entity';
import { GoodsColor } from './goods-color.entity';
import { GoodsOrigin } from './goods-origin.entity';
import { GoodsShape } from './goods-shape.entity';
import { GoodsSpecs } from './goods-specs.entity';
import { GoodsUnit } from './goods-unit.entity';
import { ParentEntity } from './parent.entity';

@Entity()
export class Goods extends ParentEntity {
    @Property({ length: 255 })
    goodsCode!: string;

    @Property({ length: 255 })
    goodsDesc!: string;

    @Property({ length: 255 })
    goodsSupplier!: string;

    @Property()
    goodsWeight!: number;

    @Property()
    goodsW!: number;

    @Property()
    goodsD!: number;

    @Property()
    goodsH!: number;

    @Property({ nullable: true })
    unitVolume?: number;

    @ManyToOne(() => GoodsUnit)
    goodsUnit: GoodsUnit;

    @ManyToOne(() => GoodsClass)
    goodsClass: GoodsClass;

    @ManyToOne(() => GoodsBrand)
    goodsBrand: GoodsBrand;

    @ManyToOne(() => GoodsColor)
    goodsColor: GoodsColor;

    @ManyToOne(() => GoodsShape)
    goodsShape: GoodsShape;

    @ManyToOne(() => GoodsSpecs, { nullable: true })
    goodsSpecs: GoodsSpecs;

    @ManyToOne(() => GoodsOrigin)
    goodsOrigin?: GoodsOrigin;

    @Property()
    safetyStock: number;

    @Property({ nullable: true })
    goodsCost?: number;

    @Property()
    goodsPrice!: number;

    @Property({ length: 255, nullable: true })
    barCode?: string;

    @Property({ length: 255 })
    openid!: string;
}
