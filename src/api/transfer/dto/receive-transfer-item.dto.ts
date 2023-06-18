import { TransferItemStatus } from '../../../common/enum/transfer-item-status.enum';

export class ReceiveTransferItemDto {
    transferItemStatus: TransferItemStatus;
    damagedQuantity = 0;
}
