import {
  Collection,
  Entity,
  Filter,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Bundle } from './bundle.entity';
import { ParentEntity } from './parent.entity';

@Entity()
@Filter({ name: 'mainFilter', cond: args => args })
export class BundleHolder extends ParentEntity {
  @Property()
  name: string;

  @Property()
  description?: string;

  @OneToMany({
    entity: () => Bundle,
    mappedBy: 'bundleHolder',
    orphanRemoval: true,
  })
  bundles = new Collection<Bundle>(this);
}
