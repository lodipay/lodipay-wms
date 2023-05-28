import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import { Inventory } from '../../database/entities/inventory.entity';
import { TransferItem } from '../../database/entities/transfer-item.entity';
import { Transfer } from '../../database/entities/transfer.entity';
import { CreateTransferItemDto } from './dto/create-transfer-item.dto';
import { UpdateTransferItemDto } from './dto/update-transfer-item.dto';

@Injectable()
export class TransferItemService {
    constructor(
        @InjectRepository(Transfer)
        private readonly transferRepo: EntityRepository<Transfer>,

        @InjectRepository(TransferItem)
        private readonly transferItemRepo: EntityRepository<TransferItem>,

        @InjectRepository(Inventory)
        private readonly inventoryRepo: EntityRepository<Inventory>,

        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create(createTransferDto: CreateTransferItemDto) {
        const transfer = await this.transferRepo.findOne(
            createTransferDto.transferId,
        );

        if (!transfer) {
            throw new InvalidArgumentException('Transfer not found');
        }

        const inventory = await this.inventoryRepo.findOne(
            createTransferDto.inventoryId,
        );

        if (!inventory) {
            throw new InvalidArgumentException('Inventory not found');
        }

        const transferItem = new TransferItem();
        transferItem.inventoryAmount = createTransferDto.inventoryAmount;
        transferItem.inventory = inventory;
        transferItem.description = createTransferDto.description;
        transfer.transferItems.add(transferItem);

        await this.em.persistAndFlush([transfer, transferItem]);

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

        let inventory;
        if (updateTransferItemDto.inventoryId) {
            inventory = await this.inventoryRepo.findOne(
                updateTransferItemDto.inventoryId,
            );

            if (!inventory) {
                throw new InvalidArgumentException('Inventory not found');
            }
        }

        transferItem.inventory = inventory;

        if (
            updateTransferItemDto.transferId &&
            updateTransferItemDto.transferId !== transferItem.transfer.id
        ) {
            const transfer = await this.transferRepo.findOne(
                updateTransferItemDto.transferId,
            );

            if (!transfer) {
                throw new InvalidArgumentException('Transfer not found');
            }

            transferItem.transfer = transfer;
        }

        transferItem.description = transferItem.description;
        transferItem.inventoryAmount =
            updateTransferItemDto.inventoryAmount ||
            transferItem.inventoryAmount;

        return this.transferItemRepo.upsert(transferItem);
    }

    async remove(id: number) {
        const transferItem = await this.findOne(id);

        await this.em.removeAndFlush(transferItem);

        return 'deleted';
    }
}
