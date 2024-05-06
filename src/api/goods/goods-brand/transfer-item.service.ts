import { FilterService } from '@/common/module/filter/filter.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
    EntityManager,
    EntityRepository,
    QueryBuilder,
} from '@mikro-orm/postgresql';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { TransferStatus } from '../../common/enum/transfer-status.enum';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import { TenantItem } from '../../database/entities/tenant-item.entity';
import { TransferItem } from '../../database/entities/transfer-item.entity';
import { Transfer } from '../../database/entities/transfer.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { InventoryService } from '../inventory/inventory.service';
import { TenantService } from '../tenant/tenant.service';
import { TransferService } from '../transfer/transfer.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { CreateTransferItemDto } from './dto/create-transfer-item.dto';
import { UpdateTransferItemDto } from './dto/update-transfer-item.dto';

@Injectable()
export class TransferItemService {
    constructor(
        @InjectRepository(TransferItem)
        private transferItemRepo: EntityRepository<TransferItem>,

        @Inject(WarehouseService)
        private warehouseService: WarehouseService,

        @Inject(forwardRef(() => TransferService))
        private transferService: TransferService,

        @Inject(InventoryService)
        private inventoryService: InventoryService,

        @Inject(TenantService)
        private tenantService: TenantService,

        private em: EntityManager,
        private filterService: FilterService,
    ) {}

    async create(createTransferItemDto: CreateTransferItemDto) {
        const transferItemExists = await this.transferItemRepo.findOne({
            transfer: createTransferItemDto.transferId,
            inventory: createTransferItemDto.inventoryId,
            fromTenant: createTransferItemDto.fromTenantId,
            toTenant: createTransferItemDto.toTenantId,
        });

        if (transferItemExists) {
            throw new InvalidArgumentException('TransferItem already exists');
        }

        const transfer = await this.transferService.findOne(
            createTransferItemDto.transferId,
        );

        if (transfer.status !== TransferStatus.NEW) {
            throw new InvalidArgumentException('Transfer status is not new');
        }

        let fromWarehouse: Warehouse;
        if (transfer.from?.warehouse?.id) {
            fromWarehouse = await this.warehouseService.getWarehouseWithOptions(
                transfer.from.id,
                {
                    populate: ['tenantItem'],
                },
            );

            const tenantItem = fromWarehouse.tenantItem
                .getItems()
                .find(
                    tenantItem =>
                        tenantItem?.inventory?.id ===
                        createTransferItemDto.inventoryId,
                );

            if (!tenantItem) {
                throw new InvalidArgumentException('Tenant item not found');
            }

            if (tenantItem.quantity - createTransferItemDto.quantity < 0) {
                throw new InvalidArgumentException(
                    'Not enough tenant item quantity',
                );
            }

            const qb = this.em.createQueryBuilder(TenantItem, 'ti');
            await qb
                .update({
                    quantity: qb.raw(
                        `ti.c_quantity - ${createTransferItemDto.quantity}`,
                    ),
                })
                .execute();
        }

        const transferItem = new TransferItem();
        transferItem.transfer = transfer;
        transferItem.quantity = createTransferItemDto.quantity;
        transferItem.description = createTransferItemDto.description;
        transferItem.inventory = await this.inventoryService.findOne(
            createTransferItemDto.inventoryId,
        );
        transferItem.fromTenant = await this.tenantService.findOne(
            createTransferItemDto.fromTenantId,
        );
        transferItem.toTenant = await this.tenantService.findOne(
            createTransferItemDto.toTenantId,
        );

        await this.em.persistAndFlush(transferItem);

        return transferItem;
    }

    search(filterDto: FilterDto) {
        return this.filterService.search<TransferItem>(TransferItem, filterDto);
    }

    async findOne(id: number) {
        const transferItem = await this.transferItemRepo.findOne(id);
        if (!transferItem) {
            throw new InvalidArgumentException('TransferItem not found');
        }
        return transferItem;
    }

    async update(id: number, updateTransferItemDto: UpdateTransferItemDto) {
        const transferItem = await this.findOne(id);

        if (updateTransferItemDto.inventoryId !== transferItem.inventory.id) {
            throw new InvalidArgumentException(
                'Inventory cannot be changed. Delete this transfer item and create a new one',
            );
        }

        if (updateTransferItemDto.fromTenantId !== transferItem.fromTenant.id) {
            throw new InvalidArgumentException(
                'Tenant cannot be changed. Delete this transfer item and create a new one',
            );
        }

        const transfer = await this.transferService.findOne(
            transferItem.transfer.id,
        );

        if (transfer.from?.warehouse?.id && updateTransferItemDto.quantity) {
            const fromWarehouse =
                await this.warehouseService.getWarehouseWithOptions(
                    transfer.from.id,
                    {
                        populate: ['tenantItem'],
                    },
                );
            const tenantItem = fromWarehouse.tenantItem
                .getItems()
                .find(
                    tenantItem =>
                        tenantItem.inventory?.id === transferItem.inventory?.id,
                );

            if (
                updateTransferItemDto.quantity >
                tenantItem.quantity + transferItem.quantity
            ) {
                throw new InvalidArgumentException(
                    'Not enough tenant item quantity',
                );
            }

            const tenantItemQb = this.em.createQueryBuilder(TenantItem, 'ti');
            if (updateTransferItemDto.quantity > transferItem.quantity) {
                await tenantItemQb
                    .update({
                        quantity: tenantItemQb.raw(
                            `ti.c_quantity - ${
                                updateTransferItemDto.quantity -
                                transferItem.quantity
                            }`,
                        ),
                        updatedAt: new Date(),
                    })
                    .where({
                        id: tenantItem.id,
                    })
                    .execute();
            } else if (updateTransferItemDto.quantity < transferItem.quantity) {
                await tenantItemQb
                    .update({
                        quantity: tenantItemQb.raw(
                            `ti.c_quantity + ${
                                transferItem.quantity -
                                updateTransferItemDto.quantity
                            }`,
                        ),
                        updatedAt: new Date(),
                    })
                    .where({
                        id: tenantItem.id,
                    })
                    .execute();
            }
        }

        transferItem.description =
            updateTransferItemDto.description || transferItem.description;
        transferItem.quantity =
            updateTransferItemDto.quantity || transferItem.quantity;
        transferItem.toTenant = await this.tenantService.findOne(
            updateTransferItemDto.toTenantId,
        );

        await this.em.persistAndFlush(transferItem);
        return transferItem;
    }

    async remove(id: number) {
        const transferItem = await this.findOne(id);

        const transfer = await this.transferService.findOne(
            transferItem.transfer.id,
        );

        if (transfer.from?.warehouse?.id) {
            await this.returnTenantItem(transfer, transferItem);
        }

        await this.em.removeAndFlush(transferItem);

        return 'deleted';
    }

    async returnTenantItem(
        transfer: Transfer,
        transferItem: TransferItem,
    ): Promise<QueryBuilder<TenantItem>> {
        const warehouse = await this.warehouseService.getWarehouseWithOptions(
            transfer.from.id,
            {
                populate: ['tenantItem'],
            },
        );

        const tenantItemToIncrease = warehouse.tenantItem
            .getItems()
            .find(
                tenantItem =>
                    tenantItem.inventory.id === transferItem.inventory.id,
            );

        const tenantItemQb = this.em.createQueryBuilder(TenantItem, 'ti');
        await tenantItemQb
            .update({
                quantity: tenantItemQb.raw(
                    `ti.c_quantity + ${transferItem.quantity}`,
                ),
                updatedAt: new Date(),
            })
            .where({
                id: tenantItemToIncrease.id,
            })
            .execute();
    }
}
