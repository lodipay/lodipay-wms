import { Module } from '@nestjs/common';
import { DestinationModule } from './destination/destination.module';
import { InventoryModule } from './inventory/inventory.module';
import { LocationModule } from './location/location.module';
import { LockModule } from './lock/lock.module';
import { OrderModule } from './order/order.module';
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({
  imports: [
    WarehouseModule,
    LocationModule,
    LockModule,
    OrderModule,
    DestinationModule,
    InventoryModule,
  ],
})
export class ApiModule {}
