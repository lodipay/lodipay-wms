import { Factory, Faker } from '@mikro-orm/seeder';
import { Bundle } from '../../entities/bundle.entity';

export class BundleFactory extends Factory<Bundle> {
    model = Bundle;

    protected definition(faker: Faker): Partial<Bundle> {
        return {
            description: faker.commerce.productName(),
            activeFrom: faker.date.past(),
            activeTo: faker.date.future(),
        };
    }
}
