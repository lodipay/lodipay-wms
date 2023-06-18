import { Factory, Faker } from '@mikro-orm/seeder';
import { Tenant } from '../../entities/tenant.entity';

export class TenantFactory extends Factory<Tenant> {
    model = Tenant;

    protected definition(faker: Faker): Partial<Tenant> {
        return {
            name: faker.commerce.productName(),
            description: faker.random.word(),
        };
    }
}
