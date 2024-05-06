import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Company {

  @PrimaryKey({ columnType: 'int8' })
  id!: string;

  @Property({ length: 255 })
  companyName!: string;

  @Property({ length: 255 })
  companyCity!: string;

  @Property({ length: 255 })
  companyAddress!: string;

  @Property({ length: 255 })
  companyContact!: string;

  @Property({ length: 255 })
  companyManager!: string;

  @Property({ length: 255 })
  creater!: string;

  @Property({ length: 255 })
  openid!: string;

  @Property()
  isDelete!: boolean;

  @Property({ length: 6 })
  createTime!: Date;

  @Property({ length: 6, nullable: true })
  updateTime?: Date;

}
