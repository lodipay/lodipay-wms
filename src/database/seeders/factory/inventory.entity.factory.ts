import { Factory, Faker } from '@mikro-orm/seeder';
import { Inventory } from '../../entities/inventory.entity';

export class InventoryFactory extends Factory<Inventory> {
    model = Inventory;

    protected definition(faker: Faker): Partial<Inventory> {
        return {
            sku: faker.datatype.uuid(),
            name: faker.commerce.productName(),
            description: faker.random.words(),
            quantity: faker.datatype.number(),
            expireDate: faker.date.recent(),
            batchCode: faker.datatype.uuid(),
            weight: faker.datatype.number(),
            width: faker.datatype.number(),
            height: faker.datatype.number(),
            depth: faker.datatype.number(),
            volume: faker.datatype.number(),
        };
    }
}
