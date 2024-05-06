import { Entity, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';

@Entity()
export class GoodsUnit extends ParentEntity {
    @Property({ length: 255 })
    goodsUnit!: string;

    @Property({ length: 255 })
    openid!: string;
}
