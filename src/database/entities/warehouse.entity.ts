import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Location } from './location.entity';

@Entity()
export class Warehouse {
  /**
   * Warehouse id
   * @example '100'
   */
  @PrimaryKey()
  id: number;

  /**
   * Warehouse name
   *
   * @example 'WH1'
   */
  @Property()
  @Unique()
  name: string;

  /**
   * Warehouse description
   *
   * @example 'warehouse 1'
   */
  @Property()
  description: string;

  @OneToMany({
    entity: () => Location,
    mappedBy: 'warehouse',
    orphanRemoval: true,
  })
  locations = new Collection<Location>(this);

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
