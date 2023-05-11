import { Module } from '@nestjs/common';
import { LocationModule } from './location/location.module';
import { LockModule } from './lock/lock.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { OrderModule } from './order/order.module';
import { DestinationModule } from './destination/destination.module';

@Module({
  imports: [WarehouseModule, LocationModule, LockModule, OrderModule, DestinationModule],
})
export class ApiModule {}
