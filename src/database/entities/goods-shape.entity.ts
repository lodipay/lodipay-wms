import { Entity, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';

@Entity()
export class GoodsShape extends ParentEntity {
    @Property({ length: 255 })
    goodsShape!: string;

    @Property({ length: 255 })
    creater!: string;

    @Property({ length: 255 })
    openid!: string;
}
