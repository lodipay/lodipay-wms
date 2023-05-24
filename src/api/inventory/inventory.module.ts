import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Inventory } from '../../database/entities/inventory.entity';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
    controllers: [InventoryController],
    providers: [InventoryService],
    imports: [MikroOrmModule.forFeature([Inventory])],
})
export class InventoryModule {}
