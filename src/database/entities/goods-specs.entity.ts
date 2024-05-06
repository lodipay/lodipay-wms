import { Entity, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';

@Entity()
export class GoodsSpecs extends ParentEntity {
    @Property({ length: 255 })
    goodsSpecs!: string;

    @Property({ length: 255 })
    creater!: string;

    @Property({ length: 255 })
    openid!: string;

    @Property()
    isDelete!: boolean;
}
