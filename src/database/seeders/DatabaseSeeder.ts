import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Warehouse } from '../entities/warehouse.entity';
import { InventoryFactory } from './factory/inventory.entity.factory';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    this.loadWarehouses(em);
    this.loadInventories(em);
  }

  private loadWarehouses(em: EntityManager) {
    for (let i = 0; i < 4; i++) {
      em.create(Warehouse, {
        name: `Warehouse ${i + 1}`,
        description: `Warehouse ${i + 1} description`,
      });
    }
  }

  private loadInventories(em: EntityManager) {
    new InventoryFactory(em).make(100);
  }
}
