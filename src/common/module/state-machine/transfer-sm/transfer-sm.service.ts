import { Injectable } from '@nestjs/common';
import { createMachine, interpret } from 'xstate';
import { TransferAction } from '../../../enum/transfer-action.enum';
import { TransferStatus } from '../../../enum/transfer-status.enum';

export interface TransferContext {
    transferId: string;
}

export type TransferEvent =
    | { type: TransferAction.CREATE }
    | { type: TransferAction.ACTIVATE }
    | { type: TransferAction.DEACTIVATE }
    | { type: TransferAction.CANCEL }
    | { type: TransferAction.PACK }
    | { type: TransferAction.PACKED }
    | { type: TransferAction.START_DELIVERY }
    | { type: TransferAction.DELIVERED }
    | { type: TransferAction.START_RECEIVE }
    | { type: TransferAction.RECEIVED }
    | { type: TransferAction.RETURN }
    | { type: TransferAction.RETURNED };

@Injectable()
export class TransferSMService {
    machine = createMachine({
        id: 'inventory-transfer',
        initial: TransferStatus.NEW,
        predictableActionArguments: true,
        states: {
            [TransferStatus.NEW]: {
                on: {
                    [TransferAction.ACTIVATE]: TransferStatus.ACTIVE,
                    [TransferAction.CANCEL]: TransferStatus.CANCELLED,
                },
            },
            [TransferStatus.ACTIVE]: {
                on: {
                    [TransferAction.DEACTIVATE]: TransferStatus.INACTIVE,
                    [TransferAction.CANCEL]: TransferStatus.CANCELLED,
                    [TransferAction.PACK]: TransferStatus.PACKING,
                },
            },
            [TransferStatus.INACTIVE]: {
                on: {
                    [TransferAction.ACTIVATE]: TransferStatus.ACTIVE,
                    [TransferAction.CANCEL]: TransferStatus.CANCELLED,
                },
            },
            [TransferStatus.PACKING]: {
                on: {
                    [TransferAction.CANCEL]: TransferStatus.CANCELLED,
                    [TransferAction.PACKED]: TransferStatus.PACKED,
                },
            },
            [TransferStatus.PACKED]: {
                on: {
                    [TransferAction.CANCEL]: TransferStatus.CANCELLED,
                    [TransferAction.START_DELIVERY]: TransferStatus.DELIVERING,
                },
            },
            [TransferStatus.DELIVERING]: {
                on: {
                    [TransferAction.RETURN]: TransferStatus.RETURNING,
                    [TransferAction.DELIVERED]: TransferStatus.DELIVERED,
                },
            },
            [TransferStatus.DELIVERED]: {
                on: {
                    [TransferAction.START_RECEIVE]: TransferStatus.RECEIVING,
                    [TransferAction.RETURN]: TransferStatus.RETURNING,
                },
            },
            [TransferStatus.RECEIVING]: {
                on: {
                    [TransferAction.RECEIVED]: TransferStatus.DONE,
                    [TransferAction.RETURN]: TransferStatus.RETURNING,
                },
            },
            [TransferStatus.RETURNING]: {
                on: {
                    [TransferAction.RETURNED]: TransferStatus.RETURNED,
                },
            },
            [TransferStatus.RETURNED]: {
                type: 'final',
            },
            [TransferStatus.CANCELLED]: {
                type: 'final',
            },
            [TransferStatus.DONE]: {
                type: 'final',
            },
        },
    });

    service = interpret(this.machine);

    constructor() {
        this.service.start();
    }

    // transition(action: TransferAction) {
    //     this.service.send(action);
    // }
}
