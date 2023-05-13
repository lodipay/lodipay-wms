import { EntityManager, MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../../../../config/microOrmConfig';
import { Inventory } from '../../entities/inventory.entity';
import { InventoryFactory } from './inventory.entity.factory';

describe('InventoryFactory', () => {
  let em: EntityManager;
  let destinationFactory: InventoryFactory;
  let inventories: Inventory[];
  let inventory: Inventory;

  beforeAll(async () => {
    const orm = await MikroORM.init({
      ...mikroOrmConfig,
      allowGlobalContext: true,
    });

    em = orm.em;
    destinationFactory = new InventoryFactory(em);
  });

  afterAll(async () => {
    await em.removeAndFlush(inventories);
    await em.removeAndFlush(inventory);
    await em.getDriver().close();
  });

  it('creates an inventory entity with valid data', async () => {
    inventory = destinationFactory.makeOne();

    expect(inventory).toBeInstanceOf(Inventory);
    expect(inventory.name).toBeDefined();
    expect(inventory.description).toBeDefined();

    await em.persistAndFlush(inventory);

    expect(inventory.id).toBeDefined();
  });

  it('creates multiple inventory entities with valid data', async () => {
    inventories = destinationFactory.make(3);

    expect(inventories.length).toBe(3);

    for (const inventory of inventories) {
      expect(inventory).toBeInstanceOf(Inventory);
      expect(inventory.name).toBeDefined();
      expect(inventory.description).toBeDefined();
    }

    await em.persistAndFlush(inventories);

    for (const inventory of inventories) {
      expect(inventory.id).toBeDefined();
    }
  });
});
