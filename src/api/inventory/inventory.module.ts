import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FilterService } from '../../common/service/filter.service';
import { Inventory } from '../../database/entities/inventory.entity';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, FilterService],
  imports: [MikroOrmModule.forFeature([Inventory])],
})
export class InventoryModule {}
