import { Module } from '@nestjs/common';
import { InventoryModule } from './inventory/inventory.module';
import { LocationModule } from './location/location.module';
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({
  imports: [WarehouseModule, LocationModule, InventoryModule],
})
export class ApiModule {}
