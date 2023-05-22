import {
  Entity,
  Filter,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BundleHolder } from './bundle-holder.entity';
import { ParentEntity } from './parent.entity';

@Entity()
@Filter({ name: 'mainFilter', cond: args => args })
export class Bundle extends ParentEntity {
  @PrimaryKey()
  id: number;

  @Property()
  description: string;

  @Property({ nullable: true })
  activeFrom?: Date;

  @Property({ nullable: true })
  activeTo?: Date;

  @ManyToOne(() => BundleHolder, {
    onUpdateIntegrity: 'set null',
    onDelete: 'cascade',
  })
  bundleHolder: BundleHolder;
}
