import { OmitType } from '@nestjs/swagger';
import { AssignWarehouseInventoryDto } from './assign-warehouse-inventory.dto';

export class UpdateWarehouseInventoryDto extends OmitType(
  AssignWarehouseInventoryDto,
  ['inventoryId'],
) {}
