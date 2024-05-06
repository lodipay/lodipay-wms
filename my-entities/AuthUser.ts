import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class AuthUser {

  @PrimaryKey()
  id!: number;

  @Property({ length: 128 })
  password!: string;

  @Property({ length: 6, nullable: true })
  lastLogin?: Date;

  @Property()
  isSuperuser!: boolean;

  @Index({ name: 'auth_user_username_6821ab7c_like' })
  @Unique({ name: 'auth_user_username_key' })
  @Property({ length: 150 })
  username!: string;

  @Property({ length: 150 })
  firstName!: string;

  @Property({ length: 150 })
  lastName!: string;

  @Property({ length: 254 })
  email!: string;

  @Property()
  isStaff!: boolean;

  @Property()
  isActive!: boolean;

  @Property({ length: 6 })
  dateJoined!: Date;

}
