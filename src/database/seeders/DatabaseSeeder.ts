import type { EntityManager } from '@mikro-orm/core';
import { faker, Seeder } from '@mikro-orm/seeder';
import { TransferStatus } from '../../common/enum/transfer-status.enum';
import { Inventory } from '../entities/inventory.entity';
import { TenantItem } from '../entities/tenant-item.entity';
import { Tenant } from '../entities/tenant.entity';
import { TransferItem } from '../entities/transfer-item.entity';
import { Transfer } from '../entities/transfer.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { DestinationFactory } from './factory/destination.entity.factory';
import { InventoryFactory } from './factory/inventory.entity.factory';
import { TenantItemFactory } from './factory/tenant-item.entity.factory';
import { TenantFactory } from './factory/tenant.entity.factory';
import { TransferFactory } from './factory/transfer.entity.factory';

export class DatabaseSeeder extends Seeder {
    warehouses: Map<string, Warehouse> = new Map();
    inventories: Inventory[];
    transfers: Transfer[];
    loadQuantity = 100;

    async run(em: EntityManager): Promise<void> {
        this.loadWarehouses(em);
        this.loadDestination(em);
        this.loadExtraDestinations(em);
        await this.loadInventories(em);
        await this.loadTenants(em);
        await this.loadTransfersWithItems(em);
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

    private async loadTransfersWithItems(em: EntityManager) {
        const transferStatusKeys = Object.keys(TransferStatus);
        const tenantItems = await em.find(TenantItem, {});
        const tenants = await em.find(Tenant, {});
        this.transfers = new TransferFactory(em)
            .each(async transfer => {
                transfer.name = faker.commerce.productName();
                transfer.status =
                    TransferStatus[
                        transferStatusKeys[
                            faker.datatype.number({
                                min: 0,
                                max: transferStatusKeys.length - 1,
                            })
                        ]
                    ];

                const [num1, num2] = this.generateNotEqualTwoNumbers(
                    1,
                    this.warehouses.size,
                );

                transfer.from = this.warehouses.get(`${num1}`);
                transfer.to = this.warehouses.get(`${num2}`);

                const tenantItemsOfFromWarehouse = tenantItems.filter(
                    tenantItem => tenantItem.warehouse.id === transfer.from.id,
                );

                const minNumber = faker.datatype.number({
                    min: 0,
                    max: tenantItemsOfFromWarehouse.length - 2,
                });
                const maxNumber = faker.datatype.number({
                    min: minNumber,
                    max: tenantItemsOfFromWarehouse.length - 1,
                });
                const randomTenantItems = tenantItemsOfFromWarehouse.slice(
                    minNumber,
                    maxNumber,
                );

                randomTenantItems.map(tenantItem => {
                    const transferItem = new TransferItem();
                    transferItem.description = faker.commerce.product();
                    transferItem.inventory = tenantItem.inventory;
                    transferItem.quantity = faker.datatype.number({
                        min: 1,
                        max: tenantItem.quantity,
                    });
                    transferItem.fromTenant = tenantItem.tenant;
                    transferItem.toTenant =
                        tenants[
                            faker.datatype.number({
                                min: 0,
                                max: tenants.length - 1,
                            })
                        ];
                    transfer.transferItems.add(transferItem);
                });
            })
            .make(this.loadQuantity);
    }

    // private loadTransferItems(em: EntityManager) {
    //     let transferIndex = 0;
    //     new TransferItemFactory(em)
    //         .each(transferItem => {
    //             transferItem.transfer = this.transfers[transferIndex];
    //             transferItem.description = faker.commerce.product();
    //             transferItem.quantity = faker.datatype.number();
    //             transferIndex++;
    //         })
    //         .make(this.loadQuantity);
    // }

    private loadTenants(em: EntityManager) {
        new TenantFactory(em)
            .each(owner => {
                owner.name = faker.company.name();

                owner.tenantItems.add(
                    new TenantItemFactory(em)
                        .each(tenantItem => {
                            tenantItem.quantity = faker.datatype.number({
                                min: 100,
                                max: 1000,
                            });
                            tenantItem.description = faker.commerce.product();
                            tenantItem.inventory = new InventoryFactory(
                                em,
                            ).makeOne();
                            tenantItem.warehouse = this.warehouses.get(
                                `${faker.datatype.number({ min: 1, max: 4 })}`,
                            );
                        })
                        .make(
                            faker.datatype.number({
                                min: 0,
                                max: 100,
                            }),
                        ),
                );
            })
            .make(10);
    }

    generateNotEqualTwoNumbers(min = 0, max = 3) {
        const number1 = faker.datatype.number({ min, max });
        let number2 = faker.datatype.number({ min, max });
        while (number1 === number2) {
            number2 = faker.datatype.number({ min, max });
        }
        return [number1, number2];
    }
}
