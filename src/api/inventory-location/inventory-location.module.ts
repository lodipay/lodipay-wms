import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { InventoryLocation } from '../../database/entities/inventory-location.entity';
import { LocationModule } from '../location/location.module';
import { TenantItemModule } from '../tenant-item/tenant-item.module';
import { InventoryLocationController } from './inventory-location.controller';
import { InventoryLocationService } from './inventory-location.service';

@Module({
    imports: [
        MikroOrmModule.forFeature([InventoryLocation]),
        LocationModule,
        TenantItemModule,
    ],
    controllers: [InventoryLocationController],
    providers: [InventoryLocationService],
})
export class InventoryLocationModule {}
