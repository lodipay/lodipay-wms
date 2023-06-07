import { Factory, Faker } from '@mikro-orm/seeder';
import { TenantItem } from '../../entities/tenant-item.entity';

export class TenantItemFactory extends Factory<TenantItem> {
    model = TenantItem;

    protected definition(faker: Faker): Partial<TenantItem> {
        return {
            description: faker.commerce.productName(),
        };
    }
}
