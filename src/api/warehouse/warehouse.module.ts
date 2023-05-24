import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { WarehouseInventory } from '../../database/entities/warehouse-inventory.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { InventoryModule } from '../inventory/inventory.module';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Warehouse, WarehouseInventory]),
    InventoryModule,
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule {}
