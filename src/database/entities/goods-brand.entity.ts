import { Entity, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';

@Entity()
export class GoodsBrand extends ParentEntity {
    @Property({ length: 255 })
    goodsBrand!: string;

    @Property({ length: 255 })
    openid!: string;
}
