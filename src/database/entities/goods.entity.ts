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

    @Property({ columnType: 'float8' })
    goodsWeight!: string;

    @Property({ columnType: 'float8' })
    goodsW!: string;

    @Property({ columnType: 'float8' })
    goodsD!: string;

    @Property({ columnType: 'float8' })
    goodsH!: string;

    @Property({ columnType: 'float8' })
    unitVolume!: string;

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

    @ManyToOne(() => GoodsSpecs)
    goodsSpecs: GoodsSpecs;

    @ManyToOne(() => GoodsOrigin)
    goodsOrigin: GoodsOrigin;

    @Property({ columnType: 'int8' })
    safetyStock!: string;

    @Property({ columnType: 'float8' })
    goodsCost!: string;

    @Property({ columnType: 'float8' })
    goodsPrice!: string;

    @Property({ length: 255 })
    barCode!: string;

    @Property({ length: 255 })
    openid!: string;
}
