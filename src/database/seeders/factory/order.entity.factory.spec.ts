import { EntityManager, MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../../../../config/microOrmConfig';
import { Destination } from '../../entities/destination.entity';
import { Order } from '../../entities/order.entity';
import { OrderFactory } from './order.entity.factory';

describe('OrderFactory', () => {
  let em: EntityManager;
  let orderFactory: OrderFactory;
  let fromDestination: Destination;
  let toDestination: Destination;
  beforeEach(async () => {
    fromDestination = new Destination('Tolgoit', 'Tolgoit description');
    toDestination = new Destination('Zaisan', 'Zaisan description');
  });

  beforeAll(async () => {
    const orm = await MikroORM.init({
      ...mikroOrmConfig,
      allowGlobalContext: true,
    });

    em = orm.em;
    orderFactory = new OrderFactory(em);
  });

  afterAll(async () => {
    await em.getDriver().close();
  });

  it('creates an order entity with valid data', async () => {
    const order = orderFactory.makeOne({
      from: fromDestination,
      to: toDestination,
    });

    expect(order).toBeInstanceOf(Order);
    expect(order.name).toBeDefined();
    expect(order.description).toBeDefined();

    await em.persistAndFlush(order);

    expect(order.id).toBeDefined();
  });

  it('creates multiple order entities with valid data', async () => {
    const orders = orderFactory
      .each(order => {
        order.from = fromDestination;
        order.to = fromDestination;
        return order;
      })
      .make(3);

    expect(orders.length).toBe(3);

    for (const order of orders) {
      expect(order).toBeInstanceOf(Order);
      expect(order.name).toBeDefined();
      expect(order.description).toBeDefined();
    }

    await em.persistAndFlush(orders);

    for (const order of orders) {
      expect(order.id).toBeDefined();
    }
  });
});
