import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Destination } from '../entities/destination.entity';
import { Warehouse } from '../entities/warehouse.entity';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (let i = 0; i < 4; i++) {
      const destination = em.create(Destination, {
        name: `Destination ${i + 1} name`,
        description: `Destination ${i + 1} description`,
      });
      em.create(Warehouse, {
        name: `Warehouse ${i + 1}`,
        description: `Warehouse ${i + 1} description`,
        destination: destination,
      });
    }
  }
}
