import { Factory, Faker } from '@mikro-orm/seeder';
import { BundleHolder } from '../../entities/bundle-holder.entity';

export class BundleHolderFactory extends Factory<BundleHolder> {
  model = BundleHolder;

  protected definition(faker: Faker): Partial<BundleHolder> {
    return {
      name: faker.commerce.productName(),
      description: faker.random.word(),
    };
  }
}
