import type { EntityManager } from '@mikro-orm/core';
import { faker, Seeder } from '@mikro-orm/seeder';
import { Destination } from '../entities/destination.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { BundleHolderFactory } from './factory/bundle-holder.entity.factory';
import { BundleFactory } from './factory/bundle.entity.factory';
import { DestinationFactory } from './factory/destination.entity.factory';
import { InventoryFactory } from './factory/inventory.entity.factory';
import { OrderFactory } from './factory/order.entity.factory';

export class DatabaseSeeder extends Seeder {
  warehouses: Map<string, Warehouse> = new Map();
  async run(em: EntityManager): Promise<void> {
    this.loadWarehouses(em);
    this.loadDestination(em);
    this.loadExtraDestinations(em);
    await this.loadOrders(em);
    this.loadInventories(em);
    this.loadBundlesHolders(em);
  }

    private loadWarehouses(em: EntityManager) {
        for (let i = 0; i < 4; i++) {
            this.warehouses.set(
                `${i + 1}`,
                em.create(Warehouse, {
                    name: `Warehouse ${i + 1}`,
                    description: `Warehouse ${i + 1} description`,
                }),
            );
        }
    }

    private loadDestination(em: EntityManager) {
        let i = 1;
        new DestinationFactory(em)
            .each(destination => {
                destination.warehouse = this.warehouses.get(`${i++}`);
            })
            .make(4);
    }

    private async loadExtraDestinations(em: EntityManager) {
        new DestinationFactory(em).make(2);
    }

    private async loadOrders(em: EntityManager) {
        const destinations = await em.find(Destination, {});

    new OrderFactory(em)
      .each(order => {
        const toDestinationIndex = faker.datatype.number({
          min: 0,
          max: destinations.length - 1,
        });
        let fromDestinationIndex = faker.datatype.number({
          min: 0,
          max: destinations.length - 1,
        });
        while (toDestinationIndex === fromDestinationIndex) {
          fromDestinationIndex = faker.datatype.number({
            min: 0,
            max: destinations.length - 1,
          });
        }
        order.from = destinations[toDestinationIndex];
        order.to = destinations[fromDestinationIndex];
      })
      .make(100);
  }

    private loadInventories(em: EntityManager) {
        new InventoryFactory(em).make(100);
    }

  private loadBundlesHolders(em: EntityManager) {
    new BundleHolderFactory(em)
      .each(owner => {
        owner.name = faker.company.name();

        owner.bundles.add(
          new BundleFactory(em)
            .each(bundle => {
              bundle.bundleQuantity = faker.datatype.number({
                min: 10,
                max: 1000,
              });
              bundle.description = faker.commerce.product();
              bundle.inventories.add(
                new InventoryFactory(em).make(
                  faker.datatype.number({
                    min: 0,
                    max: 10,
                  }),
                ),
              );
            })
            .make(
              faker.datatype.number({
                min: 0,
                max: 10,
              }),
            ),
        );
      })
      .make(10);
  }

  private generateRandomBetween(max: number, min = 1) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
