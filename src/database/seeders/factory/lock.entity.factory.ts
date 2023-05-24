import { Factory, Faker } from '@mikro-orm/seeder';
import { Lock } from '../../entities/lock.entity';

export class LockFactory extends Factory<Lock> {
    model = Lock;

    protected definition(faker: Faker): Partial<Lock> {
        return {
            reason: faker.commerce.productName(),
            activeFrom: faker.date.past(),
            activeTo: faker.date.future(),
        };
    }
}
