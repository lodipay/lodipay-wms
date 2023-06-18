import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { InventoryModule } from '../inventory/inventory.module';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';

@Module({
    imports: [MikroOrmModule.forFeature([Warehouse]), InventoryModule],
    controllers: [WarehouseController],
    providers: [WarehouseService],
    exports: [WarehouseService],
})
export class WarehouseModule {}
