import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Throttle {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  openid!: string;

  @Property({ length: 255 })
  appid!: string;

  @Property({ length: 255 })
  ip!: string;

  @Property({ length: 18 })
  method!: string;

  @Property({ length: 255 })
  tCode!: string;

  @Property({ length: 6 })
  createTime!: Date;

}
