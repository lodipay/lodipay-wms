import { Factory, Faker } from '@mikro-orm/seeder';
import { TransferItem } from '../../entities/transfer-item.entity';

export class TransferItemFactory extends Factory<TransferItem> {
    model = TransferItem;

    protected definition(faker: Faker): Partial<TransferItem> {
        return {
            description: faker.lorem.sentence(
                faker.datatype.number({ min: 1, max: 5 }),
            ),
        };
    }
}
