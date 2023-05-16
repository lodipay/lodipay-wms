import { Factory, Faker } from '@mikro-orm/seeder';
import { Warehouse } from '../../entities/warehouse.entity';

export class WarehouseFactory extends Factory<Warehouse> {
  model = Warehouse;

  protected definition(faker: Faker): Partial<Warehouse> {
    return {
      name: faker.random.words(),
      description: faker.random.words(),
    };
  }
}
