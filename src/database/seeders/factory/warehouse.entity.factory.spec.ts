import { EntityManager, MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../../../../config/microOrmConfig';
import { Warehouse } from '../../entities/warehouse.entity';
import { WarehouseFactory } from './warehouse.entity.factory';

describe('WarehouseFactory', () => {
  let em: EntityManager;
  let destinationFactory: WarehouseFactory;

  beforeAll(async () => {
    const orm = await MikroORM.init({
      ...mikroOrmConfig,
      allowGlobalContext: true,
    });

    em = orm.em;
    destinationFactory = new WarehouseFactory(em);
  });

  afterAll(async () => {
    await em.getDriver().close();
  });

  it('creates an warehouse entity with valid data', async () => {
    const warehouse = destinationFactory.makeOne();

    expect(warehouse).toBeInstanceOf(Warehouse);
    expect(warehouse.name).toBeDefined();
    expect(warehouse.description).toBeDefined();

    await em.persistAndFlush(warehouse);

    expect(warehouse.id).toBeDefined();
  });

  it('creates multiple warehouse entities with valid data', async () => {
    const warehouses = destinationFactory.make(3);

    expect(warehouses.length).toBe(3);

    for (const warehouse of warehouses) {
      expect(warehouse).toBeInstanceOf(Warehouse);
      expect(warehouse.name).toBeDefined();
      expect(warehouse.description).toBeDefined();
    }

    await em.persistAndFlush(warehouses);

    for (const warehouse of warehouses) {
      expect(warehouse.id).toBeDefined();
    }
  });
});
