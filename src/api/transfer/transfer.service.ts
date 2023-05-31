import { FilterDto } from '@/common/dto/filter.dto';
import { InvalidArgumentException } from '@/common/exception/invalid.argument.exception';
import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { TransferAction } from '../../common/enum/transfer-action.enum';
import { TransferStatus } from '../../common/enum/transfer-status.enum';
import { TransferSMService } from '../../common/module/state-machine/transfer-sm/transfer-sm.service';
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
        private readonly transferSMService: TransferSMService,
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

    async findOne(id: number) {
        const transfer = await this.transferRepository.findOne(id);

        if (!transfer) {
            throw new InvalidArgumentException('Transfer not found');
        }

        return transfer;
    }

    async update(id: number, updateTransferDto: UpdateTransferDto) {
        const transfer = await this.findOne(id);

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

        return this.em.removeAndFlush(transfer);
    }

    async activate(id: number) {
        const { transfer, nextState } = await this.getNextState(
            id,
            TransferAction.ACTIVATE,
        );

        return await this.updateTransferStatus(
            transfer,
            nextState.value as TransferStatus,
        );
    }

    async deactivate(id: number) {
        const { transfer, nextState } = await this.getNextState(
            id,
            TransferAction.DEACTIVATE,
        );

        return await this.updateTransferStatus(
            transfer,
            nextState.value as TransferStatus,
        );
    }

    async cancel(id: number) {
        const { transfer, nextState } = await this.getNextState(
            id,
            TransferAction.CANCEL,
        );

        return await this.updateTransferStatus(
            transfer,
            nextState.value as TransferStatus,
        );
    }

    async packing(id: number) {
        const { transfer, nextState } = await this.getNextState(
            id,
            TransferAction.PACK,
        );

        return await this.updateTransferStatus(
            transfer,
            nextState.value as TransferStatus,
        );
    }

    async packed(id: number) {
        const { transfer, nextState } = await this.getNextState(
            id,
            TransferAction.PACKED,
        );

        return await this.updateTransferStatus(
            transfer,
            nextState.value as TransferStatus,
        );
    }

    async startDelivery(id: number) {
        const { transfer, nextState } = await this.getNextState(
            id,
            TransferAction.START_DELIVERY,
        );

        return await this.updateTransferStatus(
            transfer,
            nextState.value as TransferStatus,
        );
    }

    async delivered(id: number) {
        const { transfer, nextState } = await this.getNextState(
            id,
            TransferAction.DELIVERED,
        );

        return await this.updateTransferStatus(
            transfer,
            nextState.value as TransferStatus,
        );
    }

    async return(id: number) {
        const { transfer, nextState } = await this.getNextState(
            id,
            TransferAction.RETURN,
        );

        return await this.updateTransferStatus(
            transfer,
            nextState.value as TransferStatus,
        );
    }

    async returned(id: number) {
        const { transfer, nextState } = await this.getNextState(
            id,
            TransferAction.RETURNED,
        );

        return await this.updateTransferStatus(
            transfer,
            nextState.value as TransferStatus,
        );
    }

    async startReceive(id: number) {
        const { transfer, nextState } = await this.getNextState(
            id,
            TransferAction.START_RECEIVE,
        );

        return await this.updateTransferStatus(
            transfer,
            nextState.value as TransferStatus,
        );
    }

    async received(id: number) {
        const { transfer, nextState } = await this.getNextState(
            id,
            TransferAction.RECEIVED,
        );

        return await this.updateTransferStatus(
            transfer,
            nextState.value as TransferStatus,
        );
    }

    async getNextState(id: number, action: TransferAction) {
        const transfer = await this.findOne(id);
        const nextState = this.transferSMService.machine.transition(
            transfer.status,
            { type: action },
        );

        if (!nextState.changed) {
            throw new InvalidArgumentException('Invalid action or state');
        }

        return {
            nextState,
            transfer,
        };
    }

    async updateTransferStatus(transfer: Transfer, status: TransferStatus) {
        transfer.status = status;
        await this.em.persistAndFlush(transfer);
        return transfer;
    }
}
