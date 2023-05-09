import { Module } from '@nestjs/common';
import { LocationModule } from './location/location.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { LockModule } from './lock/lock.module';

@Module({
  imports: [WarehouseModule, LocationModule, LockModule],
})
export class ApiModule {}
