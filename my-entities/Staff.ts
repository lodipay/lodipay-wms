import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Staff {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  staffName!: string;

  @Property({ length: 255 })
  staffType!: string;

  @Property()
  checkCode!: number;

  @Property({ length: 255 })
  openid!: string;

  @Property()
  isDelete!: boolean;

  @Property({ length: 6 })
  createTime!: Date;

  @Property({ length: 6, nullable: true })
  updateTime?: Date;

  @Property()
  errorCheckCodeCounter!: number;

  @Property()
  isLock!: boolean;

}
