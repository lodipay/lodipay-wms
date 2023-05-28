import { Factory, Faker } from '@mikro-orm/seeder';
import { WarehouseInventory } from '../../entities/warehouse-inventory.entity';

export class WarehouseInventoryFactory extends Factory<WarehouseInventory> {
    model = WarehouseInventory;

    protected definition(faker: Faker): Partial<WarehouseInventory> {
        return {
            quantity: faker.datatype.number({ min: 100, max: 2000 }),
        };
    }
}
