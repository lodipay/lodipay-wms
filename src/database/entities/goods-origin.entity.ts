import { Entity, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';

@Entity()
export class GoodsOrigin extends ParentEntity {
    @Property({ length: 255 })
    goodsOrigin!: string;

    @Property({ length: 255 })
    openid!: string;
}
