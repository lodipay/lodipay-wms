import { Factory, Faker } from '@mikro-orm/seeder';
import { TransferStatus } from '../../../common/enum/transfer-status.enum';
import { Transfer } from '../../entities/transfer.entity';

export class TransferFactory extends Factory<Transfer> {
    model = Transfer;

    protected definition(faker: Faker): Partial<Transfer> {
        const transferStatusKeys = Object.keys(TransferStatus).map(key => key);
        return {
            name: faker.random.words(5),
            description: faker.random.words(10),
            status: TransferStatus[
                faker.helpers.arrayElement(transferStatusKeys)
            ],
        };
    }
}
