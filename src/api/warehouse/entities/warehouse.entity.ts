import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Warehouse {
  @PrimaryKey()
  id: number;

  @Property()
  @ApiProperty({ example: 'WH1', description: 'Warehouse name' })
  name: string;

  @Property()
  @ApiProperty({ example: 'warehouse 1', description: 'Warehouse description' })
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
