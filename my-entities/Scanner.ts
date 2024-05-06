import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Scanner {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  mode!: string;

  @Property({ length: 255 })
  code!: string;

  @Property({ length: 255 })
  barCode!: string;

  @Property({ length: 255 })
  openid!: string;

  @Property({ length: 6 })
  createTime!: Date;

  @Property({ length: 6, nullable: true })
  updateTime?: Date;

}
