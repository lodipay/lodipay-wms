import { Factory, Faker } from '@mikro-orm/seeder';
import { OrderStatus } from '../../../common/enum/order-status.enum';
import { Order } from '../../entities/order.entity';

export class OrderFactory extends Factory<Order> {
  model = Order;

  protected definition(faker: Faker): Partial<Order> {
    const orderStatusKeys = Object.keys(OrderStatus).map(key => key);
    return {
      name: faker.random.words(5),
      description: faker.random.words(10),
      status: OrderStatus[faker.helpers.arrayElement(orderStatusKeys)],
    };
  }
}
