import type { EntityManager } from '@mikro-orm/core';
import { faker, Seeder } from '@mikro-orm/seeder';
import { Destination } from '../entities/destination.entity';
import { Inventory } from '../entities/inventory.entity';
import { Transfer } from '../entities/transfer.entity';
import { WarehouseInventory } from '../entities/warehouse-inventory.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { BundleHolderFactory } from './factory/bundle-holder.entity.factory';
import { BundleFactory } from './factory/bundle.entity.factory';
import { DestinationFactory } from './factory/destination.entity.factory';
import { InventoryFactory } from './factory/inventory.entity.factory';
import { TransferItemFactory } from './factory/transfer-item.entity.factory';
import { TransferFactory } from './factory/transfer.entity.factory';
import { WarehouseInventoryFactory } from './factory/warehouse-inventory.entity.factory';

export class DatabaseSeeder extends Seeder {
    warehouses: Map<string, Warehouse> = new Map();
    inventories: Inventory[];
    warehouseInventories: WarehouseInventory[];
    transfers: Transfer[];
    loadQuantity = 100;

    async run(em: EntityManager): Promise<void> {
        this.loadWarehouses(em);
        this.loadDestination(em);
        this.loadExtraDestinations(em);
        await this.loadTransfers(em);
        await this.loadInventories(em);
        await this.loadBundlesHolders(em);
        await this.loadWarehouseInventories(em);
        await this.loadTransferItems(em);
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

    private async loadInventories(em: EntityManager) {
        this.inventories = new InventoryFactory(em).make(this.loadQuantity);
    }

    private loadWarehouseInventories(em: EntityManager) {
        let inventoriesIndex = 0;
        this.warehouseInventories = new WarehouseInventoryFactory(em)
            .each(warehouseInventory => {
                warehouseInventory.inventory =
                    this.inventories[inventoriesIndex];
                warehouseInventory.warehouse = this.warehouses.get(
                    `${faker.datatype.number({
                        min: 1,
                        max: this.warehouses.size,
                    })}`,
                );
                inventoriesIndex++;
            })
            .make(this.loadQuantity);
    }

    private async loadTransfers(em: EntityManager) {
        const destinations = await em.find(Destination, {});

        this.transfers = new TransferFactory(em)
            .each(transfer => {
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
                transfer.from = destinations[toDestinationIndex];
                transfer.to = destinations[fromDestinationIndex];
            })
            .make(this.loadQuantity);
    }

    private loadTransferItems(em: EntityManager) {
        let transferIndex = 0;
        new TransferItemFactory(em)
            .each(transferItem => {
                transferItem.inventoryAmount = faker.datatype.number({
                    min: 1,
                    max: this.warehouseInventories[transferIndex].quantity,
                });
                transferItem.transfer = this.transfers[transferIndex];
                transferItem.inventory =
                    this.warehouseInventories[transferIndex].inventory;
                transferItem.description = faker.commerce.product();
                transferItem.inventoryAmount;
                transferIndex++;
            })
            .make(this.loadQuantity);
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
}
