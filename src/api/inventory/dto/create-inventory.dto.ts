import { OmitType } from '@nestjs/swagger';
import { Inventory } from '../../../database/entities/inventory.entity';

export class CreateInventoryDto extends OmitType(Inventory, [
    'id',
    'children',
    'parent',
] as const) {}
