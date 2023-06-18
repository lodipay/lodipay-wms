import { Factory, Faker } from '@mikro-orm/seeder';
import { Location } from '../../entities/location.entity';

export class LocationFactory extends Factory<Location> {
    model = Location;

    protected definition(faker: Faker): Partial<Location> {
        return {
            code: faker.unique(() => faker.random.alphaNumeric(20)),
            description: faker.random.words(3),
        };
    }
}
