import { FilterDto } from '@/common/dto/filter.dto';
import { InvalidArgumentException } from '@/common/exception/invalid.argument.exception';
import { NotFoundException } from '@/common/exception/not.found.exception';
import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { TransferStatus } from '../../common/enum/transfer-status.enum';
import { Destination } from '../../database/entities/destination.entity';
import { Transfer } from '../../database/entities/transfer.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Injectable()
export class TransferService {
    constructor(
        @InjectRepository(Transfer)
        private readonly transferRepository: EntityRepository<Transfer>,

        @InjectRepository(Destination)
        private readonly destRepository: EntityRepository<Destination>,

        @InjectRepository(Warehouse)
        private readonly warehouseRepository: EntityRepository<Warehouse>,

        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create(createTransferDto: CreateTransferDto) {
        const transfer = new Transfer();
        transfer.name = createTransferDto.name;
        transfer.description = createTransferDto.description;
        transfer.createdBy = createTransferDto.createdBy;
        transfer.status = TransferStatus.NEW;

        if (
            createTransferDto.toDestinationId ===
            createTransferDto.fromDestinationId
        ) {
            throw new InvalidArgumentException(
                'From and to destinations cannot be the same',
            );
        }

        const fromDestination = await this.destRepository.findOne({
            id: createTransferDto.fromDestinationId,
        });

        if (!fromDestination) {
            throw new InvalidArgumentException('Invalid from destination');
        }

        transfer.from = fromDestination;

        const toDestination = await this.destRepository.findOne({
            id: createTransferDto.toDestinationId,
        });

        if (!toDestination) {
            throw new InvalidArgumentException('Invalid to destination');
        }

        transfer.to = toDestination;

        await this.em.persistAndFlush(transfer);
        return transfer;
    }

    search(filterDto: FilterDto) {
        return this.filterService.search<Transfer>(Transfer, filterDto);
    }

    findAll() {
        return this.transferRepository.findAll();
    }

    findOne(id: number) {
        return this.transferRepository.findOne(id);
    }

    async update(id: number, updateTransferDto: UpdateTransferDto) {
        const transfer = await this.findOne(id);
        if (!transfer) {
            throw new NotFoundException('Transfer not found');
        }
        if (
            updateTransferDto.toDestinationId &&
            updateTransferDto.toDestinationId !== transfer.to.id
        ) {
            if (updateTransferDto.toDestinationId === transfer.from.id) {
                throw new InvalidArgumentException(
                    'From and to destinations cannot be the same',
                );
            }
            const toDestination = await this.destRepository.findOne({
                id: updateTransferDto.toDestinationId,
            });

            if (!toDestination) {
                throw new InvalidArgumentException('Invalid to destination');
            }

            transfer.to = toDestination;
        }
        if (
            updateTransferDto.fromDestinationId &&
            updateTransferDto.fromDestinationId !== transfer.from.id
        ) {
            if (updateTransferDto.fromDestinationId === transfer.to.id) {
                throw new InvalidArgumentException(
                    'From and to destinations cannot be the same',
                );
            }
            const fromDestination = await this.destRepository.findOne({
                id: updateTransferDto.fromDestinationId,
            });

            if (!fromDestination) {
                throw new InvalidArgumentException('Invalid from destination');
            }
            transfer.from = fromDestination;
        }

        transfer.createdBy = updateTransferDto.createdBy || transfer.createdBy;
        transfer.name = updateTransferDto.name || transfer.createdBy;
        transfer.description =
            updateTransferDto.description || transfer.createdBy;
        transfer.status = updateTransferDto.status || transfer.status;

        this.em.persistAndFlush(transfer);

        return transfer;
    }

    async remove(id: number) {
        const transfer = await this.findOne(id);

        if (!transfer) {
            throw new NotFoundException('transfer not found');
        }

        return this.em.removeAndFlush(transfer);
    }
}
