import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { InventoryLocation } from '../../database/entities/inventory-location.entity';
import { InventoryModule } from '../inventory/inventory.module';
import { LocationModule } from '../location/location.module';
import { InventoryLocationController } from './inventory-location.controller';
import { InventoryLocationService } from './inventory-location.service';

@Module({
    imports: [
        MikroOrmModule.forFeature([InventoryLocation]),
        InventoryModule,
        LocationModule,
    ],
    controllers: [InventoryLocationController],
    providers: [InventoryLocationService],
})
export class InventoryLocationModule {}
