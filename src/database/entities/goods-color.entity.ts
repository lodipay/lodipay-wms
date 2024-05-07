import { Entity, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';

@Entity()
export class GoodsColor extends ParentEntity {
    @Property({ length: 255 })
    goodsColor!: string;

    @Property({ length: 255 })
    openid!: string;
}
