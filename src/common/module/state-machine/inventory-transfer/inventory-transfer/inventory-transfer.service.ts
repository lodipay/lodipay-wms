import { Injectable } from '@nestjs/common';
import { createMachine, interpret } from 'xstate';
import { TransferAction } from '../../../../enum/transfer-action.enum';
import { TransferStatus } from '../../../../enum/transfer-status.enum';

export interface TransferContext {
    // Add any properties you need for the transfer context
    // For example:
    transferId: string;
    // ... other properties ...
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
export class InventoryTransferService {
    private machine = createMachine({
        id: 'inventory-transfer',
        initial: TransferStatus.NEW,
        states: {
            [TransferStatus.NEW]: {
                on: {
                    [TransferAction.CREATE]: TransferStatus.ACTIVE,
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

    private service = interpret(this.machine);

    constructor() {
        this.service.start();
    }

    getCurrentState() {
        return this.service.getSnapshot().value as TransferStatus;
    }

    transition(action: TransferAction) {
        this.service.send(action);
    }

    createTransfer() {
        this.transition[TransferAction.CREATE];
    }

    deactivateTransfer() {
        this.transition[TransferAction.DEACTIVATE];
    }

    cancelTransfer() {
        this.transition[TransferAction.CANCEL];
    }

    packTransfer() {
        this.transition[TransferAction.PACK];
    }

    confirmPacked() {
        this.transition[TransferAction.PACKED];
    }

    startDelivery() {
        this.transition[TransferAction.START_DELIVERY];
    }

    markDelivered() {
        this.transition[TransferAction.DELIVERED];
    }

    startReceiving() {
        this.transition[TransferAction.START_RECEIVE];
    }

    markReceived() {
        this.transition[TransferAction.RECEIVED];
    }

    requestReturn() {
        this.transition[TransferAction.RETURN];
    }

    markReturned() {
        this.transition[TransferAction.RETURNED];
    }
}
