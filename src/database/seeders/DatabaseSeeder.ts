import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Warehouse } from '../../api/warehouse/entities/warehouse.entity';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (let i = 0; i < 4; i++) {
      em.create(Warehouse, {
        name: `Warehouse ${i + 1}`,
        description: `Warehouse ${i + 1} description`,
      });
    }
  }
}
