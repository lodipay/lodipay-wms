import { OmitType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { TransferItem } from '../../../database/entities/transfer-item.entity';

export class CreateTransferItemDto extends OmitType(TransferItem, [
    'id',
    'createdAt',
    'updatedAt',
    'transfer',
    'inventory',
]) {
    @IsNumber()
    transferId: number;

    @IsNumber()
    inventoryId: number;
}
