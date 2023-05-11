import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Destination } from '../../database/entities/destination.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';

@Module({
  imports: [MikroOrmModule.forFeature([Warehouse, Destination])],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule {}
