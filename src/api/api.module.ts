import { Module } from '@nestjs/common';
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({
    imports: [WarehouseModule],
})
export class ApiModule {}
