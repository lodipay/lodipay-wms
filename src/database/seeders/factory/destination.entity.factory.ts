import { Factory, Faker } from '@mikro-orm/seeder';
import { Destination } from '../../entities/destination.entity';

export class DestinationFactory extends Factory<Destination> {
    model = Destination;

    protected definition(faker: Faker): Partial<Destination> {
        return {
            name: faker.address.streetAddress(),
            description: faker.address.street(),
        };
    }
}
