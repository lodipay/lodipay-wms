import { OmitType } from '@nestjs/swagger';
import { InventoryLocation } from '../../../database/entities/inventory-location.entity';

export class CreateInventoryLocationDto extends OmitType(InventoryLocation, [
    'id',
    'createdAt',
    'updatedAt',
    'tenantItem',
    'location',
    'status',
] as const) {
    tenantItemId: number;
    locationId: number;
    quantity: number;
}
