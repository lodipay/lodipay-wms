import { OmitType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { TransferItemStatus } from '../../../common/enum/transfer-item-status.enum';
import { TransferItem } from '../../../database/entities/transfer-item.entity';

export class CreateTransferItemDto extends OmitType(TransferItem, [
    'id',
    'createdAt',
    'updatedAt',
    'transfer',
    'inventory',
    'transferedStatus',
]) {
    @IsNumber()
    transferId: number;

    @IsNumber()
    inventoryId: number;

    @IsOptional()
    transferItemStatus?: TransferItemStatus;
}
