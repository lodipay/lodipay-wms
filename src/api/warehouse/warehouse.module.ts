import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Warehouse } from './entities/warehouse.entity';

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService],
  imports: [MikroOrmModule.forFeature([Warehouse])],
})
export class WarehouseModule {}
