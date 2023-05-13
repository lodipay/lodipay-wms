import { Factory, Faker } from '@mikro-orm/seeder';
import { Order } from '../../entities/order.entity';

export class OrderFactory extends Factory<Order> {
  model = Order;

  protected definition(faker: Faker): Partial<Order> {
    return {
      name: faker.random.words(5),
      description: faker.random.words(10),
    };
  }
}
