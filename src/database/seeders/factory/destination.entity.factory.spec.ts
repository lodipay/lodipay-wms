import { EntityManager, MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../../../../config/microOrmConfig';
import { Destination } from '../../entities/destination.entity';
import { DestinationFactory } from './destination.entity.factory';

describe('DestinationFactory', () => {
  let em: EntityManager;
  let destinationFactory: DestinationFactory;
  let destination: Destination;
  let destinations: Destination[];

  beforeAll(async () => {
    const orm = await MikroORM.init({
      ...mikroOrmConfig,
      allowGlobalContext: true,
    });

    em = orm.em;
    destinationFactory = new DestinationFactory(em);
  });

  afterAll(async () => {
    await em.removeAndFlush(destinations);
    await em.removeAndFlush(destination);
    await em.getDriver().close();
  });

  it('creates an destination entity with valid data', async () => {
    destination = destinationFactory.makeOne();

    expect(destination).toBeInstanceOf(Destination);
    expect(destination.name).toBeDefined();
    expect(destination.description).toBeDefined();

    await em.persistAndFlush(destination);

    expect(destination.id).toBeDefined();
  });

  it('creates multiple destination entities with valid data', async () => {
    destinations = destinationFactory.make(3);

    expect(destinations.length).toBe(3);

    for (const destination of destinations) {
      expect(destination).toBeInstanceOf(Destination);
      expect(destination.name).toBeDefined();
      expect(destination.description).toBeDefined();
    }

    await em.persistAndFlush(destinations);

    for (const destination of destinations) {
      expect(destination.id).toBeDefined();
    }
  });
});
