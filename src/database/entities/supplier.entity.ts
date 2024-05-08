import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';
import { SupplierLevel } from '@/common/enum/supplier-level.enum';
import { Asndetail } from './asndetail.entity';

@Entity()
export class Supplier extends ParentEntity {

  @Property({ length: 50 })
  supplierName!: string;

  @Property({ length: 50, nullable: true })
  supplierCity?: string;

  @Property({ length: 255, nullable: true })
  supplierAddress?: string;

  @Property({ length: 20 })
  supplierContact!: string;

  // relation
  @Property({ nullable: true })
  supplierManager: number;

  @Property({ nullable: true, type: 'enum'})
  supplierLevel: SupplierLevel;

  @Property({ length: 64 })
  openId!: string;

}
