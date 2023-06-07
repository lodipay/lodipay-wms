import { OmitType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { TenantItem } from '../../../database/entities/tenant-item.entity';

export class CreateTenantItemDto extends OmitType(TenantItem, [
    'id',
    'createdAt',
    'updatedAt',
    'warehouse',
    'inventory',
    'tenant',
]) {
    @IsNumber()
    tenantId: number;

    @IsNumber()
    inventoryId: number;

    @IsNumber()
    warehouseId: number;

    @IsNumber()
    quantity: number;

    @IsOptional()
    description: string;
}
