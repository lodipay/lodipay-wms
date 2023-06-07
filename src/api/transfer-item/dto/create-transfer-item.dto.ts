import { OmitType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { TransferItem } from '../../../database/entities/transfer-item.entity';

export class CreateTransferItemDto extends OmitType(TransferItem, [
    'id',
    'createdAt',
    'updatedAt',
    'transfer',
    'inventory',
    'transferedStatus',
    'fromTenant',
    'toTenant',
    'transferedStatus',
]) {
    @IsNumber()
    transferId: number;

    @IsNumber()
    inventoryId: number;

    @IsNumber()
    fromTenantId?: number;

    @IsNumber()
    toTenantId: number;
}
