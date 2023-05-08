import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

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

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
