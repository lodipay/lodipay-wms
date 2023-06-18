import { OmitType } from '@nestjs/swagger';
import { InventoryLocation } from '../../../database/entities/inventory-location.entity';

export class CreateInventoryLocationDto extends OmitType(InventoryLocation, [
    'id',
    'createdAt',
    'updatedAt',
    'inventory',
    'location',
    'status',
] as const) {
    inventoryId: number;
    locationId: number;
    quantity: number;
}
