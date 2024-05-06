import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Binset {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  binName!: string;

  @Property({ length: 255 })
  binSize!: string;

  @Property({ length: 11 })
  binProperty!: string;

  @Property()
  emptyLabel!: boolean;

  @Property({ length: 255 })
  creater!: string;

  @Property({ length: 255 })
  barCode!: string;

  @Property({ length: 255 })
  openid!: string;

  @Property()
  isDelete!: boolean;

  @Property({ length: 6 })
  createTime!: Date;

  @Property({ length: 6, nullable: true })
  updateTime?: Date;

}
